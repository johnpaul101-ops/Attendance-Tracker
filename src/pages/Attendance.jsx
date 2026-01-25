import { useContext, useEffect } from "react";
import AddStudentContext from "../contexts/AddStudentContext";
import AttendanceContext from "../contexts/UIContext";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { db } from "../config/firebase";
import moment from "moment/moment";
import Loading from "../components/Loading";
const Attendance = () => {
  const { getFilteredListData } = useContext(AddStudentContext);
  const { sectionId } = useParams();
  const { user, isLoading } = useContext(AuthContext);
  let filteredList = getFilteredListData(sectionId);
  const now = moment();
  filteredList.sort((a, b) => a.fullName.localeCompare(b.fullName));
  let time = moment().format("h:mm:ss a");

  const handleStatusChange = async (id, newStatus, newTime) => {
    try {
      await updateDoc(
        doc(db, "users", user.uid, "sections", sectionId, "students", id),
        {
          status: newStatus,
          time: newTime,
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!sectionId || !user.uid) return;
    const markLateStudents = async () => {
      const studentsCol = collection(
        db,
        "users",
        user.uid,
        "sections",
        sectionId,
        "students",
      );
      const cutoff = moment().hour(7).minute(0).second(0);
      if (now.isBefore(cutoff)) return;

      const snapshot = await getDocs(studentsCol);
      let haslate = false;
      const batch = writeBatch(db);

      snapshot.docs.forEach(async (studentDoc) => {
        const data = studentDoc.data();

        if (data.status === "none") {
          haslate = true;
          batch.update(studentDoc.ref, { status: "late", time });
        }
      });
      if (haslate) {
        await batch.commit();
      }
    };

    const resetAttendance = async () => {
      const studentsRef = collection(
        db,
        "users",
        user.uid,
        "sections",
        sectionId,
        "students",
      );

      const today = moment().format("YYYY-MM-DD");
      const snapshot = await getDocs(studentsRef);
      const batch = writeBatch(db);
      let reset = false;
      snapshot.docs.forEach((studentDoc) => {
        const data = studentDoc.data();

        if (data.lastUpdated !== today) {
          reset = true;
          batch.update(studentDoc.ref, {
            status: "none",
            lastUpdated: today,
          });
        }
      });
      if (reset) {
        await batch.commit();
      }
    };
    markLateStudents();
    resetAttendance();
  }, [sectionId, user?.uid]);
  return (
    <div className="bg-white shadow-md rounded-xl p-3 md:p-6 w-full lg:w-[70%] flex flex-col min-h-screen">
      {isLoading ? <Loading /> : ""}
      <table>
        <thead>
          <tr className="border-b border-b-zinc-300">
            <td className="font-body-text font-medium pb-3 text-[16px] lg:text-lg w-[60%]">
              Name
            </td>

            <td className="font-body-text font-medium pb-3 text-[16px] lg:text-lg px-2 text-center">
              Present
            </td>
            <td className="font-body-text font-medium pb-3 text-[16px] lg:text-lg px-2 text-center">
              Late
            </td>
            <td className="font-body-text font-medium pb-3 text-[16px] lg:text-lg px-2 text-center">
              Absent
            </td>
          </tr>
        </thead>

        <tbody>
          {filteredList.map(({ id, fullName, status }) => (
            <tr className="border-b border-b-zinc-300" key={id}>
              <td className="py-3 font-body-text text-zinc-600 text-sm lg:text-[16px] w-[60%] capitalize">
                {fullName}
              </td>

              <td className="py-3 text-center">
                <input
                  type="radio"
                  name={`status_${id}`}
                  checked={status === "present"}
                  className="size-6 accent-green-700 cursor-pointer"
                  onChange={() => handleStatusChange(id, "present", time)}
                />
              </td>

              <td className="py-3 text-center">
                <input
                  type="radio"
                  name={`status_${id}`}
                  checked={status === "late"}
                  className="size-6 accent-yellow-700 focus:outline-none cursor-pointer"
                  onChange={() => handleStatusChange(id, "late", time)}
                />
              </td>

              <td className="py-3 text-center">
                <input
                  type="radio"
                  name={`status_${id}`}
                  checked={status === "absent"}
                  className="size-6 accent-red-500 cursor-pointer"
                  onChange={() => handleStatusChange(id, "absent", time)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
