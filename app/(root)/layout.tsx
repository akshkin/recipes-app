import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      <div className="flex">
        <div className="w-full">{children}</div>
        <Sidebar />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Layout;
