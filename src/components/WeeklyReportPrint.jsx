import { useContext } from "react";
import { FaRegFileExcel } from "react-icons/fa";
import moment from "moment/moment";
import { IoIosPrint } from "react-icons/io";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { collection, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import AuthContext from "../contexts/AuthContext";
import AddStudentContext from "../contexts/AddStudentContext";
import { addDoc, writeBatch } from "firebase/firestore";
import { CiSaveDown2 } from "react-icons/ci";

const WeeklyReportPrint = ({ weeklyDocs, weeklySummary, date }) => {
  const { user, sections } = useContext(AuthContext);
  const { sectionId } = useParams();
  const currentSection = sections.filter((section) => section.id === sectionId);
  const { adviserName } = useContext(AddStudentContext);

  let male = weeklySummary.filter((stud) => stud.gender === "male");
  let female = weeklySummary.filter((stud) => stud.gender === "female");

  const getLetter = (status) => {
    if (status === "present") return "P";
    if (status === "late") return "T";
    if (status === "absent") return "I";
    return "";
  };

  const getDayKey = (date) => {
    return new Date(date)
      .toLocaleDateString("en-US", { weekday: "short" })
      .toLowerCase();
  };

  let studentsMap = {};

  weeklyDocs.forEach((doc) => {
    const day = getDayKey(doc.createdAt);

    doc.students.forEach((student) => {
      if (!studentsMap[student.id]) {
        studentsMap[student.id] = {
          fullName: `${student.fullName}`.toUpperCase(),
          attendance: {
            mon: "",
            tue: "",
            wed: "",
            thu: "",
            fri: "",
            sat: "",
          },
          totals: {
            present: 0,
            late: 0,
            absent: 0,
          },
          date,
        };
      }

      const letter = getLetter(student.status);
      studentsMap[student.id].attendance[day] = letter;

      if (student.status === "present")
        studentsMap[student.id].totals.present++;
      if (student.status === "late") studentsMap[student.id].totals.late++;
      if (student.status === "absent") studentsMap[student.id].totals.absent++;
    });
  });
  let studentArray = Object.values(studentsMap);

  studentArray.sort((a, b) => a.fullName.localeCompare(b.fullName));

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "#",
          "NAME",
          "MON",
          "TUE",
          "WED",
          "THU",
          "FRI",
          "SAT",
          "TOTAL PRESENT",
          "TOTAL LATE",
          "TOTAL ABSENT",
          "DATE",
        ],
      ],
      { origin: "A1" },
    );

    const rows = studentArray.map((s, i) => [
      i + 1,
      s.fullName,
      s.attendance?.mon,
      s.attendance?.tue,
      s.attendance?.wed,
      s.attendance?.thu,
      s.attendance?.fri,
      s.attendance?.sat,
      s.totals.present,
      s.totals.late,
      s.totals.absent,
      s.date,
    ]);

    XLSX.utils.sheet_add_aoa(ws, rows, { origin: "A2" });

    ws["!cols"] = [
      { wch: 4 },
      { wch: 45 },
      { wch: 5 },
      { wch: 5 },
      { wch: 5 },
      { wch: 5 },
      { wch: 5 },
      { wch: 5 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Weekly Attendance");
    XLSX.writeFile(
      wb,
      `${currentSection.map((section) => section.sectionName)} Weekly Attendance.xlsx`,
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
      students: [...weeklySummary],
      typeOfAttendance: "Weekly Attendance Report",
      createdAt: moment().format("YYYY-MM-DD"),
      prevWeekDocs: [...weeklyDocs],
    });
    const monthId = moment().format("YYYY-MM");
    const batch = writeBatch(db);

    const monthRef = doc(
      db,
      "users",
      user.uid,
      "sections",
      sectionId,
      "attendance_monthly",
      monthId,
    );

    batch.set(
      monthRef,
      {
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        monthLabel: moment().format("MMMM YYYY"),
      },
      { merge: true },
    );

    const weekKey = `week_${Math.ceil(moment().date() / 7)}`;

    weeklySummary.forEach((student) => {
      const studentId = student.id;
      const monthlyRef = doc(
        db,
        "users",
        user.uid,
        "sections",
        sectionId,
        "attendance_monthly",
        monthId,
        "students",
        studentId,
      );

      const currentAttendance = studentsMap[studentId].attendance;

      batch.set(
        monthlyRef,
        {
          name: student.fullName,

          attendance: {
            [weekKey]: {
              mon: currentAttendance.mon || "",
              tue: currentAttendance.tue || "",
              wed: currentAttendance.wed || "",
              thu: currentAttendance.thu || "",
              fri: currentAttendance.fri || "",
              sat: currentAttendance.sat || "",
            },
          },
        },
        { merge: true },
      );
    });

    await batch.commit();
  };

  return (
    <>
      <div className="bg-white w-full lg:w-[80%] min-h-screen p-4 lg:p-7 rounded-lg shadow-md relative print:hidden flex flex-col gap-3.5">
        <div className="flex gap-5 self-center">
          <div className="flex flex-col items-center gap-1.5 ">
            <p className="text-xs">Print to PDF</p>
            <IoIosPrint
              className="size-6 cursor-pointer active:bg-black/55 active:scale-125"
              onClick={() => window.print()}
            />
          </div>
          <div className="flex flex-col items-center gap-1.5 ">
            <p className="text-xs">Print to Excel</p>
            <FaRegFileExcel
              className="size-6 cursor-pointer active:bg-black/55 active:scale-125"
              onClick={exportToExcel}
            />
          </div>
          <div className="flex flex-col items-center gap-1.5 ">
            <p className="text-xs">Save Attendance</p>
            <CiSaveDown2
              className="size-6 cursor-pointer active:bg-black/55 active:scale-125"
              onClick={saveAttendance}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 mt-16">
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
              {male?.map(({ id, fullName, present, late, absent }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                  <td className="text-lg py-3 w-96 text-center uppercase">
                    {`${fullName}`}
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
              {female?.map(({ id, fullName, present, late, absent }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                  <td className="text-lg py-3 w-96 text-center uppercase">
                    {`${fullName}`}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Smaller Screen Below */}
        <div className="flex flex-col gap-3.5 sm:hidden">
          {weeklySummary.map(({ fullName, present, late, absent }, i) => (
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
          ))}
        </div>
      </div>

      {/* Print Format */}
      <div className="bg-white w-full min-h-screen p-[10mm]  hidden print:block">
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
                <td className="text-sm pb-2 w-52 uppercase font-medium text-center">
                  Student No.
                </td>
                <td className="text-sm pb-2 w-96 uppercase font-medium text-center">
                  Name
                </td>
                <td className="text-sm pb-2 w-80 uppercase font-medium text-center">
                  Present
                </td>
                <td className="text-sm pb-2 w-80 uppercase font-medium text-center">
                  Late
                </td>
                <td className="text-sm pb-2 w-80 uppercase font-medium text-center">
                  Absent
                </td>
              </tr>
            </thead>
            <tbody>
              {male?.map(({ id, fullName, present, late, absent }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-sm py-2 w-52 text-center">{i + 1}</td>
                  <td className="text-sm py-2 w-96 text-center uppercase">
                    {`${fullName}`}
                  </td>
                  <td className="text-sm py-2 w-80 text-center uppercase">
                    {present}
                  </td>
                  <td className="text-sm py-2 w-80 text-center uppercase">
                    {late}
                  </td>
                  <td className="text-sm py-2 w-80 text-center uppercase">
                    {absent}
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
                <td className="text-sm pb-2 w-52 uppercase font-medium text-center">
                  Student No.
                </td>
                <td className="text-sm pb-2 w-96 uppercase font-medium text-center">
                  Name
                </td>
                <td className="text-sm pb-2 w-80 uppercase font-medium text-center">
                  Present
                </td>
                <td className="text-sm pb-2 w-80 uppercase font-medium text-center">
                  Late
                </td>
                <td className="text-sm pb-2 w-80 uppercase font-medium text-center">
                  Absent
                </td>
              </tr>
            </thead>

            <tbody>
              {female?.map(({ id, fullName, present, late, absent }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-sm py-2 w-52 text-center">{i + 1}</td>
                  <td className="text-sm py-2 w-96 text-center uppercase">
                    {`${fullName}`}
                  </td>
                  <td className="text-sm py-2 w-80 text-center uppercase">
                    {present}
                  </td>
                  <td className="text-sm py-2 w-80 text-center uppercase">
                    {late}
                  </td>
                  <td className="text-sm py-2 w-80 text-center uppercase">
                    {absent}
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

export default WeeklyReportPrint;
