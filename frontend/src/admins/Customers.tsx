import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BackendCustomer {
  _id: string;
  userName: string;
  email: string;
  verified: boolean;
  addresses: any[];
  createdAt: string;
}

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<BackendCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const adminToken = localStorage.getItem("adminToken");

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/customer`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.status === 401) {
        toast.error("Unauthorized. Please login again.");
        return;
      }

      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/customer/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      toast.success("Customer deleted");
      fetchCustomers();
    } catch (err) {
      toast.error("Failed to delete customer");
    }
  };

  const filtered = customers.filter((c) =>
    c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin/blogs")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-serif">
              Customer Management
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Addresses</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow key={c._id}>
                        <TableCell>{c.userName}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>
                          {c.verified ? (
                            <span className="text-green-600">Verified</span>
                          ) : (
                            <span className="text-red-500">Not Verified</span>
                          )}
                        </TableCell>

                        <TableCell>{c.addresses?.length || 0}</TableCell>

                        <TableCell>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(c._id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>

              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Customers;
