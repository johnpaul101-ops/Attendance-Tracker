import { Link, useLocation, useParams } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { GoChecklist } from "react-icons/go";
import { useContext } from "react";
import AttendanceContext from "../contexts/UIContext";
import { PiStudent } from "react-icons/pi";
import SignOutButton from "./SignOutButton";
import { GoHistory } from "react-icons/go";

const Sidebar = () => {
  const links = [
    {
      name: "Dashboard",
      path: "dashboard",
      icon: <LuLayoutDashboard />,
    },
    {
      name: "Students",
      path: "students",
      icon: <PiStudent />,
    },
    {
      name: "Attendance",
      path: "attendance",
      icon: <GoChecklist />,
    },
    {
      name: "Report",
      path: "report",
      icon: <HiOutlineDocumentReport />,
    },
    {
      name: "Weekly Report",
      path: "weekly-report",
      icon: <HiOutlineDocumentReport />,
    },
    {
      name: "Attendance History",
      path: "attendance-history",
      icon: <GoHistory />,
    },
  ];
  const { sectionId } = useParams();
  const location = useLocation();
  const { toggleSidebar, setToggleSidebar } = useContext(AttendanceContext);

  return (
    <>
      <div className="w-80 hidden lg:block">
        <ul className="flex flex-col gap-3 w-full">
          {links.map((link) => (
            <Link
              to={link.path}
              key={link.name}
              className={`flex gap-3.5 items-center text-xl ${
                `/sections/${sectionId}/${link.path}` === location.pathname
                  ? "bg-green-400 text-white shadow-none"
                  : "bg-white text-zinc-400"
              } py-4 pl-8 rounded-br-xl rounded-tr-xl shadow-md hover:bg-green-400 hover:text-white hover:shadow-none transition-all duration-200 ease-in-out`}
            >
              <span>{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </ul>
      </div>

      {/* Mobile Screen Sidebar */}
      <div
        className={`w-screen h-screen bg-black/50 absolute 
        ${toggleSidebar ? "block" : "hidden"} lg:hidden z-20`}
        onClick={() => setToggleSidebar(false)}
      ></div>
      <div
        className={`absolute top-0 transition-all duration-200 ease-in-out ${
          toggleSidebar ? "right-0" : "right-[-1000px]"
        } bg-white lg:hidden h-screen w-80 z-50`}
      >
        <ul className="flex flex-col gap-3 w-full">
          {links.map((link) => (
            <Link
              to={link.path}
              key={link.name}
              className={`flex gap-3.5 items-center text-x ${
                `/sections/${sectionId}/${link.path}` === location.pathname
                  ? "bg-green-400 text-white"
                  : "bg-white text-zinc-400"
              } py-4 pl-8 rounded-br-xl rounded-tr-xl shadow-md`}
              onClick={() => setToggleSidebar(false)}
            >
              <span>{link.icon}</span>
              {link.name}
            </Link>
          ))}
          <SignOutButton />
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
