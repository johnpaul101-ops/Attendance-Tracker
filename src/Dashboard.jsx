import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

const Dashboard = () => {
  return (
    <div className="w-full min-h-dvh flex flex-col bg-zinc-100 overflow-hidden">
      <Navbar />
      <div className="flex mt-5 lg:pr-5 gap-5 relative">
        <Sidebar />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
