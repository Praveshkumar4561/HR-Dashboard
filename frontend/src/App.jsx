import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import AdminRegister from "./components/AdminRegister";
import AdminLogin from "./components/AdminLogin";
import Layout from "./Layout";
import AdminDashboard from "./components/AdminDashboard";
import Employee from "./components/Employee";
import Attendance from "./components/Attendance";
import Leaves from "./components/Leaves";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return <RouterProvider router={router} />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to="/admin/register" replace />} />

      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<Employee />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leaves" element={<Leaves />} />
        </Route>
      </Route>
    </>
  )
);

export default App;
