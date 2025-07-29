import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Sidebar />
      <div className="sidebarlayout" style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
