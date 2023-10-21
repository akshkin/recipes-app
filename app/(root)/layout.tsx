import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      <div className="flex mt-8">
        <div className="w-full">{children}</div>
        <Sidebar />
      </div>
    </div>
  );
}

export default Layout;
