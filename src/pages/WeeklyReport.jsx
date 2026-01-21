import WeeklyReportPrint from "../components/WeeklyReportPrint";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import moment from "moment/moment";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

const WeeklyReport = () => {
  const { user } = useContext(AuthContext);
  const { sectionId } = useParams();
  const [weeklyDocs, setWeeklyDocs] = useState([]);
  let date = moment().format("MMMM Do YYYY");
  useEffect(() => {
    if (!user || !sectionId) return;

    let collectionRef = collection(
      db,
      "users",
      user.uid,
      "sections",
      sectionId,
      "attendance",
    );

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const currentWeekDocs = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      const startOfWeek = moment().startOf("week").add(1, "day");
      const endOfWeek = moment()
        .endOf("week")
        .add(1, "day")
        .subtract(1, "minute");

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

  let weeklyReport = weeklyDocs.filter((attendance) => {
    if (attendance.typeOfAttendance == "Daily Attendance") return attendance;
  });

  let getAllstudents = weeklyReport.flatMap((doc) => doc.students);

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

  return (
    <WeeklyReportPrint
      weeklyDocs={weeklyReport}
      weeklySummary={weeklySummary}
      date={date}
    />
  );
};

export default WeeklyReport;
