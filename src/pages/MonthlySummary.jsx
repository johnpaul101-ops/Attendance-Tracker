import { useContext, useEffect, useState } from "react";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import { IoCheckboxOutline } from "react-icons/io5";
import { TfiFaceSad } from "react-icons/tfi";
import { MdOutlineAssignmentLate } from "react-icons/md";
import { useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { FaRegFileExcel } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";

export const Card = ({ bgColor, icon, totalNum, status }) => {
  return (
    <div className={`${bgColor} flex gap-3.5 items-center p-4`}>
      <div className="p-2 bg-white rounded-lg">{icon}</div>
      <div className="flex flex-col text-slate-950 gap-1">
        <h1 className="text-2xl font-medium">{totalNum}</h1>
        <p className="text-sm">{status}</p>
      </div>
    </div>
  );
};

const MonthlySummary = () => {
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [totals, setTotals] = useState({ present: 0, late: 0, absent: 0 });
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM"),
  );
  const [savedMonths, setSavedMonths] = useState([]);
  const [selectMonth, setSelectMonth] = useState(false);
  const { user } = useContext(AuthContext);
  const { sectionId } = useParams();

  useEffect(() => {
    if (!user || !sectionId) return;

    let studentsRef = collection(
      db,
      "users",
      user.uid,
      "sections",
      sectionId,
      "attendance_monthly",
      selectedMonth,
      "students",
    );

    const unsubscribe = onSnapshot(studentsRef, (snapshot) => {
      setMonthlyReports(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    });

    return () => unsubscribe();
  }, [user?.uid, sectionId, selectedMonth]);

  useEffect(() => {
    let totalLate = 0;
    let totalAbsent = 0;
    let totalPresent = 0;

    monthlyReports.forEach((student) => {
      if (student.attendance) {
        Object.values(student.attendance).forEach((week) => {
          Object.values(week).forEach((status) => {
            if (status === "P") totalPresent++;
            if (status === "T") totalLate++;
            if (status === "I") totalAbsent++;
          });
        });
      }
    });

    setTotals({ present: totalPresent, late: totalLate, absent: totalAbsent });
  }, [monthlyReports]);

  let studentsMap = {};

  monthlyReports.forEach((doc) => {
    studentsMap[doc.id] = {
      name: `${doc.name}`.toUpperCase(),
      attendance: doc.attendance,
      totals: {
        present: 0,
        late: 0,
        absent: 0,
      },
    };

    Object.values(doc.attendance).forEach((week) => {
      Object.values(week).forEach((status) => {
        if (status === "P") studentsMap[doc.id].totals.present++;
        if (status === "I") studentsMap[doc.id].totals.absent++;
        if (status === "T") studentsMap[doc.id].totals.late++;
      });
    });
  });

  let studentArray = Object.values(studentsMap);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const header = [
      "#",
      "NAME",
      "MON",
      "TUE",
      "WED",
      "THU",
      "FRI",
      "SAT",
      "MON",
      "TUE",
      "WED",
      "THU",
      "FRI",
      "SAT",
      "MON",
      "TUE",
      "WED",
      "THU",
      "FRI",
      "SAT",
      "MON",
      "TUE",
      "WED",
      "THU",
      "FRI",
      "SAT",
      "TOTAL PRESENT",
      "TOTAL LATE",
      "TOTAL ABSENT",
    ];

    const rows = studentArray.map((s, i) => {
      const att = s.attendance || {};

      return [
        i + 1,
        s.name,

        att.week_1?.mon || "",
        att.week_1?.tue || "",
        att.week_1?.wed || "",
        att.week_1?.thu || "",
        att.week_1?.fri || "",
        att.week_1?.sat || "",

        att.week_2?.mon || "",
        att.week_2?.tue || "",
        att.week_2?.wed || "",
        att.week_2?.thu || "",
        att.week_2?.fri || "",
        att.week_2?.sat || "",

        att.week_3?.mon || "",
        att.week_3?.tue || "",
        att.week_3?.wed || "",
        att.week_3?.thu || "",
        att.week_3?.fri || "",
        att.week_3?.sat || "",

        att.week_4?.mon || "",
        att.week_4?.tue || "",
        att.week_4?.wed || "",
        att.week_4?.thu || "",
        att.week_4?.fri || "",
        att.week_4?.sat || "",

        s.totals.present,
        s.totals.late,
        s.totals.absent,
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);

    ws["!cols"] = [
      { wch: 4 },
      { wch: 40 },
      ...Array(24).fill({ wch: 5 }),
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Monthly Attendance");
    XLSX.writeFile(wb, `Monthly_Attendance_${selectedMonth}.xlsx`);
  };

  useEffect(() => {
    if (!user || !sectionId) return;

    let collectionRef = collection(
      db,
      "users",
      user.uid,
      "sections",
      sectionId,
      "attendance_monthly",
    );

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      let months = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setSavedMonths(months);
    });

    return () => unsubscribe();
  }, [user?.uid, sectionId, selectedMonth]);

  return (
    <section className="bg-white shadow-lg w-full h-[80vh] rounded-2xl p-7 flex flex-col gap-28 12q">
      <h1 className="text-center font-header text-2xl">
        Attendance summary for the month of {selectedMonth}
      </h1>

      <div className="flex flex-col gap-12">
        <div className="flex gap-10 items-center">
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-xs">Print to Excel</p>
            <FaRegFileExcel
              className="size-6 cursor-pointer active:bg-black/55 active:scale-125"
              onClick={exportToExcel}
            />
          </div>

          <div className="flex flex-col items-center gap-1.5 relative">
            <p className="text-xs">Select Month</p>
            <FaRegCalendarAlt
              className="size-6 cursor-pointer active:bg-black/55 active:scale-125"
              onClick={() => setSelectMonth((prev) => !prev)}
            />

            <div
              className={`absolute bg-white p-4 top-15 -left-33 sm:left-10 shadow-xl w-48 rounded-xl ${selectMonth ? "block" : "hidden"}`}
            >
              {savedMonths.map(({ id, monthLabel }) => (
                <div className="flex gap-4 border-b-black border-b-2 pb-3">
                  <label htmlFor="radio">{monthLabel}</label>
                  <input
                    type="radio"
                    name={monthLabel}
                    className="cursor-pointer"
                    value={id}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <Card
            status={"Total Present"}
            bgColor={"bg-green-300"}
            totalNum={totals.present}
            icon={<IoCheckboxOutline className="size-9" />}
          />
          <Card
            status={"Total Late"}
            bgColor={"bg-yellow-200"}
            totalNum={totals.late}
            icon={<MdOutlineAssignmentLate className="size-9" />}
          />
          <Card
            status={"Total Absent"}
            bgColor={"bg-red-400"}
            totalNum={totals.absent}
            icon={<TfiFaceSad className="size-9" />}
          />
        </div>
      </div>
    </section>
  );
};

export default MonthlySummary;
