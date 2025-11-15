import { useEffect, useState } from "react";
import StatCard from "@/admins/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const API = import.meta.env.VITE_API_URL;
  const adminToken = localStorage.getItem("adminToken");

  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [profit, setProfit] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [products, setProducts] = useState(0);

  const [monthlyData, setMonthlyData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const [growth, setGrowth] = useState({
    revenueChange: 0,
    profitChange: 0,
    customerChange: 0,
    productChange: 0,
  });


  const headers = {
    Authorization: `Bearer ${adminToken}`,
  };

  /** Fetch all dashboard stats */
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [revRes, custRes, prodRes, growthRes, monthRes, salesRes] = await Promise.all([
        fetch(`${API}/admin/stats/revenue`, { headers }),
        fetch(`${API}/admin/stats/customers`, { headers }),
        fetch(`${API}/admin/stats/products`, { headers }),
        fetch(`${API}/admin/stats/growth`, { headers }),
        fetch(`${API}/admin/stats/monthly-revenue`, { headers }),
        fetch(`${API}/admin/stats/product-sales`, { headers }),
      ]);

      const rev = await revRes.json();
      const cust = await custRes.json();
      const prod = await prodRes.json();
      const growthData = await growthRes.json();
      const monthly = await monthRes.json();
      const sales = await salesRes.json();

      setRevenue(rev.totalRevenue);
      setProfit(rev.totalProfit);
      setCustomers(cust.totalCustomers);
      setProducts(prod.totalProducts);
      setGrowth(growthData);
      setMonthlyData(monthly);

      // Convert product sales map
      const salesFormatted = sales.map((item: any) => ({
        name: item.name,
        sales: item.sales,
      }));

      setSalesData(salesFormatted);

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <LayoutDashboard className="w-6 h-6 mr-2" />
          Dashboard
        </h1>
      </div>

      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={`₹${revenue.toLocaleString()}`}
              change={`${growth.revenueChange.toFixed(1)}% from last month`}
              icon={DollarSign}
              trend={growth.revenueChange >= 0 ? "up" : "down"}
            />
            <StatCard
              title="Total Profit"
              value={`₹${profit.toLocaleString()}`}
              change={`${growth.profitChange.toFixed(1)}% from last month`}
              icon={TrendingUp}
              trend={growth.profitChange >= 0 ? "up" : "down"}
            />
            <StatCard
              title="Active Customers"
              value={customers.toString()}
              change={`${growth.customerChange.toFixed(1)}% from last month`}
              icon={Users}
              trend={growth.customerChange >= 0 ? "up" : "down"}
            />
            <StatCard
              title="Active Products"
              value={products.toString()}
              change={`${growth.productChange.toFixed(1)}% from last month`}
              icon={Briefcase}
              trend={growth.productChange >= 0 ? "up" : "down"}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#007bff"
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#28a745"
                    strokeWidth={2}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Product Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded-md"></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#28a745" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* Skeleton Card Loader */
function SkeletonCard() {
  return (
    <div className="border rounded-xl p-4 bg-muted animate-pulse h-[130px]"></div>
  );
}
