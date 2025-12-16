import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
const Section = () => {
  return (
    <div className="flex flex-col bg-zinc-100 min-h-screen overflow-hidden">
      <Navbar />
      <div className="flex mt-5 gap-7 mr-0 lg:mr-5 relative">
        <Sidebar />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Section;
