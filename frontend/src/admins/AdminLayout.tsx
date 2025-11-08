import { Outlet, useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import { LayoutDashboard, Mail, LogOut, Users, Package } from "lucide-react";

const ACTIVE_ITEM_BLUE = "#414141ff";
const API_BASE = "http://localhost:5000/api/adminAuth";

export default function AdminLayout() {
  const navigate = useNavigate();
  const storedAdmin = JSON.parse(localStorage.getItem("adminUser") || "null");
  const token = localStorage.getItem("adminToken");
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!storedAdmin || storedAdmin.role !== "admin") {
      navigate("/admin-login");
    }
  }, [storedAdmin, navigate]);

  // const fetchUnreadCount = async () => {
  //   if (!token) return;
  //   try {
  //     const res = await fetch(`${API_BASE}/notifications`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await res.json();

  //     if (res.ok) {
  //       setMessageCount(data.notifications ? data.notifications.length : 0);
  //     } else {
  //       console.error("Error fetching notification count:", data.message);
  //       setMessageCount(0);
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch notification count:", err);
  //     setMessageCount(0);
  //   }
  // };

  // useEffect(() => {
  //   fetchUnreadCount();
  //   const intervalId = setInterval(fetchUnreadCount, 3000);
  //   return () => clearInterval(intervalId);
  // }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 shadow-2xl flex flex-col fixed h-full text-foreground bg-secondary">
        <div className="p-6 flex flex-col items-center border-b border-gray-700">
        <div className="text-xl font-semibold">Admin Panel</div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <button
            className="flex items-center gap-3 w-full p-3 rounded font-medium hover:bg-gray-400"
            style={ isActive("/admin/dashboard") ? { backgroundColor: ACTIVE_ITEM_BLUE } : {} }
            onClick={() => navigate("/admin/dashboard")}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button
            className="flex items-center gap-3 w-full p-3 rounded font-medium hover:bg-gray-400"
            style={ isActive("/admin/clients") ? { backgroundColor: ACTIVE_ITEM_BLUE } : {} }
            onClick={() => navigate("/admin/clients")}
          >
            <Users className="w-5 h-5" /> Customers
          </button>
          <button
            className="flex items-center gap-3 w-full p-3 rounded font-medium hover:bg-gray-400"
            style={ isActive("/admin/categories") ? { backgroundColor: ACTIVE_ITEM_BLUE } : {} }
            onClick={() => navigate("/admin/categories")}
          >
            <Package className="w-5 h-5" /> Categories
          </button>
          <button
            className="flex items-center gap-3 w-full p-3 rounded font-medium hover:bg-gray-400"
            style={ isActive("/admin/products") ? { backgroundColor: ACTIVE_ITEM_BLUE } : {} }
            onClick={() => navigate("/admin/products")}
          >
            <Package className="w-5 h-5" /> Products
          </button>
          <button
            className="flex items-center gap-3 w-full p-3 hover:bg-gray-400 rounded font-medium"
            style={ isActive("/admin/messages") ? { backgroundColor: ACTIVE_ITEM_BLUE } : {} }
            onClick={() => navigate("/admin/messages")}
            >
            <Mail className="w-5 h-5" /> Messages
            {messageCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {messageCount}
            </span>
        )}
          </button>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-700">
            <button
                className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-900/50 rounded"
                onClick={handleLogout}
            >
                <LogOut className="w-5 h-5" /> Logout
            </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white ml-64">
         {/* <Outlet context={{ refetchMessages: fetchUnreadCount }} /> */}
         <Outlet />
       </main>
    </div>
  );
};