import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Lock, Phone } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
const API = `${API_URL}/auth`;

export default function AdminLogin() {
  const [mainId, setmainId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mainId, password}),
      });

      const data = await res.json();

      if (res.ok) {
        // Save JWT token & admin info in localStorage
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.admin));

        alert("Login successful");
        navigate("/admin/dashboard");
      } else {
          setError(data.message || "Login failed");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-0 shadow-card-hover bg-muted backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-hover rounded-full flex items-center justify-center animate-scale-in">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Admin Login
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Sign in to access your admin dashboard
            </CardDescription>
            {error && <p className="text-red-500">{error}</p>}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainId" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  mainId
                </Label>
                <Input
                  id="mainId"
                  type="mainId"
                  placeholder="Enter mainId"
                  value={mainId}
                  onChange={(e) => setmainId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
