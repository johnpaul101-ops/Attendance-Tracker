import { IoArrowBackOutline } from "react-icons/io5";
import { IoMenuOutline } from "react-icons/io5";
import { HiOutlineXMark } from "react-icons/hi2";
import { useContext } from "react";
import AttendanceContext from "../contexts/UIContext";
import SearchInput from "./SearchInput";
import SignOutButton from "./SignOutButton";

const Navbar = () => {
  const { toggleSidebar, setToggleSidebar, expandSearch, setExpandSearch } =
    useContext(AttendanceContext);

  return (
    <nav className="w-screen h-28 p-5 md:p-10 shadow-md flex items-center justify-between print:hidden">
      <div className="flex gap-7 items-center">
        <div>
          <h1
            className={`font-header text-2xl font-medium text-slate-950 ${
              expandSearch ? "hidden" : ""
            }`}
          >
            Attendance <br />
            <span className="text-blue-400">Tracker</span>
          </h1>
        </div>

        <SearchInput isMobile={false} />
      </div>
      <SignOutButton isHidden={true} />

      {/* Mobile Screen Navbar*/}
      <div
        className={`flex gap-3 items-center ${
          expandSearch ? "w-full" : ""
        } lg:hidden`}
      >
        <IoArrowBackOutline
          className={`size-6 lg:hidden ${
            expandSearch ? "block" : "hidden"
          } cursor-pointer`}
          onClick={() => setExpandSearch(false)}
        />
        <div className="flex w-full">
          <SearchInput isMobile={true} />

          {toggleSidebar ? (
            <HiOutlineXMark
              onClick={() => setToggleSidebar(false)}
              className={`size-10 lg:hidden cursor-pointer ${
                expandSearch ? "hidden" : ""
              }`}
            />
          ) : (
            <IoMenuOutline
              onClick={() => setToggleSidebar(true)}
              className={`size-10 lg:hidden cursor-pointer ${
                expandSearch ? "hidden" : ""
              }`}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
