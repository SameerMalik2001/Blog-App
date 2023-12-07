import React from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";

function App() {
  return(
    <div className="flex shrink-0">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default App;
