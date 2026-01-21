import { useContext } from "react";
import { FaRegFileExcel } from "react-icons/fa";
import Button from "../components/Button";
import moment from "moment/moment";
import { IoIosPrint } from "react-icons/io";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import AuthContext from "../contexts/AuthContext";
import AddStudentContext from "../contexts/AddStudentContext";

const Print = ({ students, buttonHidden, date }) => {
  const { user, sections } = useContext(AuthContext);
  const { sectionId } = useParams();
  const { adviserName } = useContext(AddStudentContext);
  const currentSection = sections.filter((section) => section.id === sectionId);
  let male = students.filter((student) => student.gender === "male");
  let female = students.filter((student) => student.gender === "female");

  students.sort((a, b) => a.fullName.localeCompare(b.fullName));

  const getLetter = (status) => {
    if (status === "present") return "P";
    if (status === "late") return "T";
    if (status === "absent") return "I";
    return "";
  };

  const formatStudentForExcel = students.map((student) => ({
    fullName: `${student.fullName}`.toUpperCase(),
    gender: `${student.gender}`.toUpperCase(),
    status: getLetter(student.status),
    time: `${student.time}`.toUpperCase(),
    lastUpdated: student.lastUpdated,
  }));

  const exportToExcel = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatStudentForExcel);

    ws["!cols"] = [
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    XLSX.utils.sheet_add_aoa(
      ws,
      [["Name", "Gender", "Status", "Time", "Date"]],
      { origin: "A1" },
    );
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    XLSX.writeFile(
      wb,
      `${currentSection.map(
        (section) => section.sectionName,
      )} Daily Attendance.xlsx`,
    );
  };

  const saveAttendance = async () => {
    const collectionRef = collection(
      db,
      "users",
      user.uid,
      "sections",
      sectionId,
      "attendance",
    );

    await addDoc(collectionRef, {
      students: [...students],
      typeOfAttendance: "Daily Attendance",
      createdAt: moment().format("YYYY-MM-DD"),
    });
  };

  return (
    <>
      <div className="bg-white w-full lg:w-[80%] min-h-screen p-4 lg:p-7 rounded-lg shadow-md relative print:hidden flex flex-col gap-3.5">
        <IoIosPrint
          className="size-6 mb-10 absolute right-8 cursor-pointer"
          onClick={() => window.print()}
        />
        <FaRegFileExcel
          className="size-6 absolute right-19 cursor-pointer"
          onClick={exportToExcel}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 mt-12 ">
          <div className="flex flex-col gap-2.5 text-center sm:text-start">
            <h1 className="font-bold uppercase">
              La Consolacion University Philippines
            </h1>
            {currentSection.map((section) => (
              <h1 className="font-bold uppercase" key={section.id}>
                Section: {section.sectionName}
              </h1>
            ))}
          </div>
          <div className="flex flex-col gap-2.5 text-center sm:text-start">
            <h1 className="font-bold uppercase">Date: {date}</h1>
            <h1 className="font-bold uppercase">Adviser: {adviserName}</h1>
          </div>
        </div>

        <div className="hidden sm:block">
          <h1 className="text-slate-950 text-2xl font-header mb-3">Male</h1>
          <table>
            <thead>
              <tr className="border-b border-b-zinc-300">
                <td className="text-lg pb-3 w-52 uppercase font-medium text-center">
                  Student No.
                </td>
                <td className="text-lg pb-3 w-96 uppercase font-medium text-center">
                  Name
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Status
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Time
                </td>
              </tr>
            </thead>
            <tbody>
              {male?.map(({ id, fullName, status, time }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                  <td className="text-lg py-3 w-96 text-center uppercase">
                    {`${fullName}`}
                  </td>
                  <td className="text-lg py-3 w-80 text-center uppercase">
                    {status}
                  </td>
                  <td className="text-lg py-3 w-86 text-center uppercase">
                    {time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="hidden sm:block mt-16">
          <h1 className="text-slate-950 text-2xl font-header mb-3">Female</h1>
          <table>
            <thead>
              <tr className="border-b border-b-zinc-300">
                <td className="text-lg pb-3 w-52 uppercase font-medium text-center">
                  Student No.
                </td>
                <td className="text-lg pb-3 w-96 uppercase font-medium text-center">
                  Name
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Status
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Time
                </td>
              </tr>
            </thead>

            <tbody>
              {female?.map(({ id, fullName, status, time }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                  <td className="text-lg py-3 w-96 text-center uppercase">
                    {`${fullName}`}
                  </td>
                  <td className="text-lg py-3 w-80 text-center uppercase">
                    {status}
                  </td>
                  <td className="text-lg py-3 w-86 text-center uppercase">
                    {time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Smaller Screen Below */}
        <div className="flex flex-col gap-3.5 sm:hidden">
          {students?.map(({ fullName, status, time }, i) => (
            <div
              className="bg-zinc-300 p-3 rounded-lg shadow-md flex flex-col gap-2.5"
              key={i}
            >
              <h1 className="uppercase">
                <b>Student No. : </b>
                {i + 1}
              </h1>

              <h1 className="uppercase">
                <b>Name: </b>
                {`${fullName}`}
              </h1>
              <h1 className="uppercase">
                <b>Status: </b>
                {status}
              </h1>
              <h1 className="uppercase">
                <b>Time: </b>
                {time}
              </h1>
            </div>
          ))}
        </div>
        <Button
          isGray={false}
          btnText={"Save Attendance"}
          handleBtnClick={saveAttendance}
          buttonHidden={buttonHidden}
        />
      </div>

      {/* Print Format */}
      <div className="bg-white w-full h-[297mm] p-[10mm]  hidden print:block">
        <div className="flex  justify-between mb-12">
          <div className="flex flex-col gap-2.5">
            <h1 className="font-bold uppercase">
              La Consolacion University Philippines
            </h1>
            {currentSection.map((section) => (
              <h1 className="font-bold uppercase" key={section.id}>
                Section: {section.sectionName}
              </h1>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <h1 className="font-bold uppercase">Date: {date}</h1>
            <h1 className="font-bold uppercase">Adviser: {adviserName}</h1>
          </div>
        </div>

        <div>
          <h1 className="text-slate-950 text-2xl font-header mb-3">Male</h1>
          <table>
            <thead>
              <tr className="border-b border-b-zinc-300">
                <td className="text-lg pb-3 w-52 uppercase font-medium text-center">
                  Student No.
                </td>
                <td className="text-lg pb-3 w-96 uppercase font-medium text-center">
                  Name
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Status
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Time
                </td>
              </tr>
            </thead>
            <tbody>
              {male?.map(({ id, fullName, status, time }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                  <td className="text-lg py-3 w-96 text-center uppercase">
                    {`${fullName}`}
                  </td>
                  <td className="text-lg py-3 w-80 text-center uppercase">
                    {status}
                  </td>
                  <td className="text-lg py-3 w-86 text-center uppercase">
                    {time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16">
          <h1 className="text-slate-950 text-2xl font-header mb-3">Female</h1>
          <table>
            <thead>
              <tr className="border-b border-b-zinc-300">
                <td className="text-lg pb-3 w-52 uppercase font-medium text-center">
                  Student No.
                </td>
                <td className="text-lg pb-3 w-96 uppercase font-medium text-center">
                  Name
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Status
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Time
                </td>
              </tr>
            </thead>

            <tbody>
              {female?.map(({ id, fullName, status, time }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                  <td className="text-lg py-3 w-96 text-center uppercase">
                    {`${fullName}`}
                  </td>
                  <td className="text-lg py-3 w-80 text-center uppercase">
                    {status}
                  </td>
                  <td className="text-lg py-3 w-86 text-center uppercase">
                    {time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Print;
