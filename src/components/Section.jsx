import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
const Section = () => {
  return (
    <div className="flex flex-col bg-zinc-100 min-h-screen overflow-hidden print:overflow-visible">
      <Navbar />
      <div className="flex gap-7 mr-0 lg:mr-5 relative mt-36 print:mt-0">
        <Sidebar />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Section;
