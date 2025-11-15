// src/pages/Orders.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

type BackendOrderItem = {
  productId?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type BackendOrder = {
  _id: string;
  userId?: { _id?: string; name?: string; email?: string } | string;
  items: BackendOrderItem[];
  total: number;
  paymentId?: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  address?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
};

type UiOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { id: string; name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  orderDate: string;
  deliveryDate?: string;
};

const statusMapBackendToUi = (s: BackendOrder["status"]) =>
  s.toLowerCase() as UiOrder["status"];

const statusMapUiToBackend = (s: UiOrder["status"]) =>
  // convert UI lowercase to backend TitleCase
  s === "pending"
    ? "Pending"
    : s === "processing"
    ? "Processing"
    : s === "shipped"
    ? "Shipped"
    : s === "delivered"
    ? "Delivered"
    : "Cancelled";

const Orders = () => {
  const API = import.meta.env.VITE_API_URL;
  const adminToken = localStorage.getItem("adminToken") || "";
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<UiOrder | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // fetch & map backend order -> UiOrder
  const mapOrder = (o: BackendOrder): UiOrder => {
    const customer =
      typeof o.userId === "string"
        ? { userName: "Customer", email: "" }
        : o.userId || { userName: "Customer", email: "" };

    const orderNumber = o.paymentId ? `PAY-${o.paymentId.slice(-6)}` : o._id;
    const shippingAddress =
      typeof o.address === "string"
        ? o.address
        : o.address
        ? [
            o.address.address,
            o.address.city,
            o.address.state,
            o.address.zipCode,
          ]
            .filter(Boolean)
            .join(", ")
        : "—";

    return {
      id: o._id,
      orderNumber,
      customerName: (customer as any)?.userName || "Customer",
      customerEmail: customer?.email || "",
      items: o.items.map((it, idx) => ({
        id: it.productId || `${o._id}-${idx}`,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
      })),
      total: o.total || 0,
      status: statusMapBackendToUi(o.status),
      shippingAddress,
      orderDate: new Date(o.createdAt).toLocaleDateString(),
      deliveryDate:
        o.status === "Delivered" && o.updatedAt
          ? new Date(o.updatedAt).toLocaleDateString()
          : undefined,
    };
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/orders`, {
        headers: {
          "Content-Type": "application/json",
          // you specified adminToken as the header key
          adminToken: adminToken,
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error("Unauthorized. Please login with admin credentials.");
        setOrders([]);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch orders");
      }

      const data: BackendOrder[] = await res.json();
      const mapped = data.map(mapOrder);
      setOrders(mapped);
    } catch (err: any) {
      console.error("Fetch orders error:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderDetails = async (orderId: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API}/admin/orders/single/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          adminToken: adminToken,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }
      const data: BackendOrder = await res.json();
      setSelectedOrder(mapOrder(data));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: UiOrder["status"]) => {
    const backendStatus = statusMapUiToBackend(newStatus);
    try {
      const res = await fetch(`${API}/admin/orders/status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          adminToken: adminToken,
        },
        body: JSON.stringify({ status: backendStatus }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to update status");
      }

      const json = await res.json();
      toast.success("Order status updated");
      // update local list
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, deliveryDate: backendStatus === "Delivered" ? new Date().toLocaleDateString() : o.deliveryDate } : o))
      );
      // if selected open, refresh it
      if (selectedOrder?.id === orderId) {
        fetchOrderDetails(orderId);
      }
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API}/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          adminToken: adminToken,
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to delete");
      }

      toast.success("Order deleted");
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err) {
      console.error("Delete order error:", err);
      toast.error("Failed to delete order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: UiOrder["status"]) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "shipped":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Order Management</h1>
            <p className="text-muted-foreground">Manage and track all customer orders</p>
          </div>
          <div>
            <Button onClick={() => fetchOrders()}>{loading ? "Refreshing..." : "Refresh"}</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{orderStats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Pending</p>
            <p className="text-2xl font-bold text-foreground">{orderStats.pending}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Processing</p>
            <p className="text-2xl font-bold text-foreground">{orderStats.processing}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Shipped</p>
            <p className="text-2xl font-bold text-foreground">{orderStats.shipped}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Delivered</p>
            <p className="text-2xl font-bold text-foreground">{orderStats.delivered}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {loading ? "Loading orders..." : "No orders found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.items.length} item(s)</TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value as UiOrder["status"])}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                              {order.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.orderDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fetchOrderDetails(order.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                              <DialogDescription>{selectedOrder?.orderNumber}</DialogDescription>
                            </DialogHeader>
                            {detailLoading ? (
                              <div className="p-6 text-center">Loading...</div>
                            ) : selectedOrder ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-foreground mb-1">Customer</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.customerName}</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground mb-1">Status</p>
                                    <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="capitalize">
                                      {selectedOrder.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground mb-1">Shipping Address</p>
                                  <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground mb-2">Order Items</p>
                                  <div className="border border-border rounded-lg overflow-hidden">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Product</TableHead>
                                          <TableHead>Quantity</TableHead>
                                          <TableHead>Price</TableHead>
                                          <TableHead>Subtotal</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedOrder.items.map((item) => (
                                          <TableRow key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>${item.price.toFixed(2)}</TableCell>
                                            <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-border">
                                  <p className="text-lg font-semibold text-foreground">Total</p>
                                  <p className="text-lg font-semibold text-foreground">${selectedOrder.total.toFixed(2)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Order Date</p>
                                    <p className="font-medium text-foreground">{selectedOrder.orderDate}</p>
                                  </div>
                                  {selectedOrder.deliveryDate && (
                                    <div>
                                      <p className="text-muted-foreground">Delivery Date</p>
                                      <p className="font-medium text-foreground">{selectedOrder.deliveryDate}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="p-6 text-center text-muted-foreground">No details</div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Order</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete order {order.orderNumber}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Orders;
