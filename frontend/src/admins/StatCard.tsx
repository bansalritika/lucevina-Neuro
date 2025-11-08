import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ title, value, change, icon: Icon, trend }) {
  return (
    <Card className="overflow-hidden transition-all shadow-lg bg-secondary backdrop-blur-lg rounded-xl ">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-surface opacity-70">{title}</p>
            <p className="text-3xl font-bold text-surface">{value}</p>
            <p
              className="text-sm flex items-center gap-1"
              style={{ color: trend === "up" ? "hsl(var(--green))" : "hsl(var(--destructive))" }}
            >
              <span>{trend === "up" ? "▲" : "▼"}</span>
              {change}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center">
            <Icon className="h-6 w-6 text-secondary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
