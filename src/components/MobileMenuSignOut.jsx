import { useContext } from "react";
import SignOutButton from "./SignOutButton";
import AttendanceContext from "../contexts/UIContext";

const MobileMenuSignOut = () => {
  const { toggleSidebar, setToggleSidebar } = useContext(AttendanceContext);
  return (
    <>
      <div
        className={`w-full h-screen bg-black/65 absolute top-0 z-20 lg:hidden ${
          toggleSidebar ? "right-0" : "right-[-1000px]"
        }`}
        onClick={() => setToggleSidebar(false)}
      ></div>
      <div
        className={`bg-white w-80 min-h-screen lg:hidden  absolute top-0 z-50 shadow-2xl ${
          toggleSidebar ? "right-0" : "right-[-1000px]"
        } transition-all duration-200 ease-in-out`}
      >
        <SignOutButton />
      </div>
    </>
  );
};

export default MobileMenuSignOut;
