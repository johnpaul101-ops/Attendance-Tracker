import moment from "moment/moment";
import { useContext, useEffect } from "react";
import AttendanceContext from "../contexts/UIContext";
import StudentsStatusCard from "../components/StudentsStatusCard";
import { PiStudent } from "react-icons/pi";
import { IoCheckboxOutline } from "react-icons/io5";
import { TfiFaceSad } from "react-icons/tfi";
import { MdOutlineAssignmentLate } from "react-icons/md";
import AddStudentContext from "../contexts/AddStudentContext";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const Home = () => {
  let date = moment().format("MMMM Do YYYY");
  const { time } = useContext(AttendanceContext);
  const {
    totalStudents,
    presentCount,
    lateCount,
    absentCount,
    setCurrentSection,
  } = useContext(AddStudentContext);
  const { sectionId } = useParams();

  useEffect(() => {
    setCurrentSection(sectionId);
  }, [sectionId]);

  let navigate = useNavigate();

  const handleGoBackToMainDashboard = () => {
    navigate("/");
  };

  return (
    <div className="bg-white p-10 rounded-xl flex flex-col items-center gap-11 relative z-0">
      <div
        className="absolute left-3 top-6 flex items-center gap-2 cursor-pointer"
        onClick={handleGoBackToMainDashboard}
      >
        <IoIosArrowBack className="size-6" />
        <p>Go Back</p>
      </div>
      <div className="bg-blue-300 text-white p-4 w-2xl rounded-lg flex flex-col gap-3.5 items-center mt-7">
        <h1 className="text-4xl">{date}</h1>
        <p className="text-2xl uppercase">{time}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <StudentsStatusCard
          icon={<PiStudent className="size-9" />}
          bgColor={"bg-blue-300"}
          totalNum={totalStudents}
          status={"Total Students"}
        />
        <StudentsStatusCard
          icon={<IoCheckboxOutline className="size-9" />}
          bgColor={"bg-green-300"}
          totalNum={presentCount}
          status={"Present Today"}
        />
        <StudentsStatusCard
          icon={<TfiFaceSad className="size-9" />}
          bgColor={"bg-red-400"}
          totalNum={absentCount}
          status={"Absent Today"}
        />
        <StudentsStatusCard
          icon={<MdOutlineAssignmentLate className="size-9" />}
          bgColor={"bg-yellow-200"}
          totalNum={lateCount}
          status={"Late Today"}
        />
      </div>
    </div>
  );
};

export default Home;
