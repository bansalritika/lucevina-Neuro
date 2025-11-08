import StatCard from "@/admins/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Briefcase, LayoutDashboard } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000, profit: 12000 },
  { month: "Feb", revenue: 52000, profit: 15000 },
  { month: "Mar", revenue: 48000, profit: 13500 },
  { month: "Apr", revenue: 61000, profit: 18000 },
  { month: "May", revenue: 70000, profit: 21000 },
  { month: "Jun", revenue: 68000, profit: 20000 },
];

const serviceData = [
  { name: "P1", projects: 12 },
  { name: "P2", projects: 18 },
  { name: "P3", projects: 15 },
  { name: "P4", projects: 12 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 p-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <LayoutDashboard className="w-6 h-6 mr-2" />Dashboard
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$344K"
          change="+12.5% from last month"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Total Profit"
          value="$99.5K"
          change="+8.2% from last month"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Active Customers"
          value="142"
          change="+5 new this month"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Active Products"
          value="69"
          change="-3 from last month"
          icon={Briefcase}
          trend="down"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--card))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--green))"
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--card))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="projects" fill="hsl(var(--green))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};