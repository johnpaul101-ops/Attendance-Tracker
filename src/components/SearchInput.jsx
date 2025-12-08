import { CiSearch } from "react-icons/ci";
import AttendanceContext from "../contexts/UIContext";
import { useContext } from "react";
import AddStudentContext from "../contexts/AddStudentContext";
const SearchInput = ({ isMobile }) => {
  const { expandSearch, setExpandSearch } = useContext(AttendanceContext);
  const { searchInput, setSearchInput } = useContext(AddStudentContext);
  return isMobile ? (
    <div className="relative flex items-center w-full lg:hidden">
      <CiSearch
        className={`absolute left-1.5 size-6 cursor-pointer md:block`}
        onClick={() => setExpandSearch(true)}
      />
      <input
        type="text"
        placeholder="Search for student"
        className={`bg-gray-200 text-md py-2.5 pl-9 w-0 ${
          expandSearch
            ? "w-[90%] transition-[width] ease-in duration-200 shadow-lg"
            : ""
        }  focus:outline-none rounded-lg`}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  ) : (
    <div className="relative items-center w-full hidden lg:flex">
      <CiSearch
        className={`absolute left-1.5 size-6 cursor-pointer ${
          expandSearch ? "block" : "hidden"
        } lg:block`}
      />
      <input
        type="text"
        placeholder="Search for student"
        className={`bg-gray-200 text-md py-2.5 pl-9 focus:outline-none rounded-lg w-64 focus:w-xl transition-[width] duration-400 ease-in-out`}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
