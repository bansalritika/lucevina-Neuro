import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  console.log("AdminUser:", adminUser);

  if (!adminUser || !adminToken || adminUser.role !== "admin") {
    return <Navigate to="/admin-login" replace/>;
  }

  return children;
};

