import { useContext, useEffect, useState } from "react";
import { FaRegFileExcel } from "react-icons/fa";
import moment from "moment/moment";
import { IoIosPrint } from "react-icons/io";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import AuthContext from "../contexts/AuthContext";
import AddStudentContext from "../contexts/AddStudentContext";

const WeeklyReport = () => {
  const { user, sections } = useContext(AuthContext);
  const { sectionId } = useParams();
  let date = moment().format("MMMM Do YYYY");
  const [weeklyDocs, setWeeklyDocs] = useState([]);
  const currentSection = sections.filter((section) => section.id === sectionId);
  const { adviserName } = useContext(AddStudentContext);
  useEffect(() => {
    if (!user || !sectionId) return;

    let collectionRef = collection(
      db,
      "users",
      user.uid,
      "sections",
      sectionId,
      "attendance"
    );

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const currentWeekDocs = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      const startOfWeek = moment().startOf("week");
      const endOfWeek = moment().endOf("week").subtract(1, "minute");

      const filteredDocs = currentWeekDocs.filter((doc) => {
        const attendanceDate = moment(doc.createdAt);

        return (
          attendanceDate.isSameOrAfter(startOfWeek) &&
          attendanceDate.isSameOrBefore(endOfWeek)
        );
      });
      setWeeklyDocs(filteredDocs);
    });

    return () => unsubscribe();
  }, [user, sectionId]);

  let getAllstudents = weeklyDocs.flatMap((doc) => doc.students);

  let students = {};

  getAllstudents.forEach((student) => {
    if (!students[student.id]) {
      students[student.id] = {
        ...student,
        present: 0,
        late: 0,
        absent: 0,
      };
    }

    if (student.status === "present") students[student.id].present++;
    if (student.status === "late") students[student.id].late++;
    if (student.status === "absent") students[student.id].absent++;
  });

  let weeklySummary = Object.values(students);

  let male = weeklySummary.filter((stud) => stud.gender === "male");
  let female = weeklySummary.filter((stud) => stud.gender === "female");

  const formatStudentForExcel = weeklySummary.map((student) => ({
    id: student.id,
    lastName: student.lastName,
    name: student.name,
    middleName: student.middleName,
    gender: student.gender,
    present: student.present,
    late: student.late,
    absent: student.absent,
  }));

  const exportToExcel = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatStudentForExcel);

    ws["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "Id",
          "Last Name ",
          "Name",
          "Middle Name",
          "Gender",
          "Present",
          "Late",
          "Absent",
        ],
      ],
      { origin: "A1" }
    );
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    XLSX.writeFile(
      wb,
      `${currentSection.map(
        (section) => section.sectionName
      )} Weekly Attendance Report.xlsx`
    );
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
                  Present
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Late
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Absent
                </td>
              </tr>
            </thead>
            <tbody>
              {male?.map(
                (
                  { id, name, lastName, middleName, present, late, absent },
                  i
                ) => (
                  <tr className="border-b border-b-zinc-300" key={id}>
                    <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                    <td className="text-lg py-3 w-96 text-center uppercase">
                      {`${lastName}, ${name} ${middleName}`}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {present}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {late}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {absent}
                    </td>
                  </tr>
                )
              )}
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
                  Present
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Late
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Absent
                </td>
              </tr>
            </thead>

            <tbody>
              {female?.map(
                (
                  { id, name, lastName, middleName, present, late, absent },
                  i
                ) => (
                  <tr className="border-b border-b-zinc-300" key={id}>
                    <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                    <td className="text-lg py-3 w-96 text-center uppercase">
                      {`${lastName}, ${name} ${middleName}`}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {present}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {late}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {absent}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Smaller Screen Below */}
        <div className="flex flex-col gap-3.5 sm:hidden">
          {weeklySummary.map(
            ({ name, lastName, middleName, present, late, absent }, i) => (
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
                  {`${lastName}, ${name} ${middleName}`}
                </h1>
                <h1 className="uppercase">
                  <b>Present: </b>
                  {present}
                </h1>
                <h1 className="uppercase">
                  <b>Late: </b>
                  {late}
                </h1>
                <h1 className="uppercase">
                  <b>Absent: </b>
                  {absent}
                </h1>
              </div>
            )
          )}
        </div>
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
                  Present
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Late
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Absent
                </td>
              </tr>
            </thead>
            <tbody>
              {male?.map(
                (
                  { id, name, lastName, middleName, present, late, absent },
                  i
                ) => (
                  <tr className="border-b border-b-zinc-300" key={id}>
                    <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                    <td className="text-lg py-3 w-96 text-center uppercase">
                      {`${lastName}, ${name} ${middleName}`}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {present}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {late}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {absent}
                    </td>
                  </tr>
                )
              )}
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
                  Present
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Late
                </td>
                <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                  Absent
                </td>
              </tr>
            </thead>

            <tbody>
              {female?.map(
                (
                  { id, name, lastName, middleName, present, late, absent },
                  i
                ) => (
                  <tr className="border-b border-b-zinc-300" key={id}>
                    <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                    <td className="text-lg py-3 w-96 text-center uppercase">
                      {`${lastName}, ${name} ${middleName}`}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {present}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {late}
                    </td>
                    <td className="text-lg py-3 w-80 text-center uppercase">
                      {absent}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WeeklyReport;
