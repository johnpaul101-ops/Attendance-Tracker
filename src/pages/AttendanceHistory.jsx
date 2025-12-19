import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { HiOutlineXMark } from "react-icons/hi2";
const AttendanceHistory = () => {
  const [prevAttendance, setPrevAttendance] = useState([]);
  const { sectionId } = useParams();
  const { user } = useContext(AuthContext);
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
      setPrevAttendance(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, [user, sectionId]);

  const handleRemovePrevAttendance = async (id) => {
    await deleteDoc(
      doc(db, "users", user.uid, "sections", sectionId, "attendance", id)
    );
  };

  return (
    <div className="bg-white p-6 w-full min-h-[80vh] rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {prevAttendance.map(({ createdAt, id }) => (
          <div
            className="bg-white border border-zinc-300 shadow-sm p-3 relative hover:shadow-lg cursor-pointer transition duration-200 ease-in-out flex flex-col gap-3.5"
            key={id}
          >
            <h1 className="text-lg">{createdAt}</h1>

            <Link to={`${id}`} className="text-green-500">
              View Attendance
            </Link>
            <HiOutlineXMark
              onClick={() => handleRemovePrevAttendance(id)}
              className="size-6 absolute top-3 right-3"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceHistory;
