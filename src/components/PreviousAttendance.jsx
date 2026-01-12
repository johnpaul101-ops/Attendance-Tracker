import { useContext, useEffect, useState } from "react";
import Print from "./Print";
import { useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import WeeklyReportPrint from "./WeeklyReportPrint";

const PreviousAttendance = () => {
  const [prevAttendance, setPrevAttendance] = useState([]);
  const { sectionId, attendanceId } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !sectionId || !attendanceId) return;

    let docRef = doc(
      db,
      "users",
      user.uid,
      "sections",
      sectionId,
      "attendance",
      attendanceId
    );

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setPrevAttendance(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, [user, sectionId, attendanceId]);

  if (prevAttendance.typeOfAttendance === "Daily Attendance") {
    return (
      <Print
        buttonHidden={true}
        students={prevAttendance.students || []}
        date={prevAttendance.createdAt}
      />
    );
  } else {
    return (
      <WeeklyReportPrint
        weeklyDocs={prevAttendance.prevWeekDocs || []}
        weeklySummary={prevAttendance.students || []}
      />
    );
  }
};

export default PreviousAttendance;
