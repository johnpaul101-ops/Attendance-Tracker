import { useContext, useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import StudentInfoInput from "../components/StudentInfoInput";
import Button from "../components/Button";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import AuthContext from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import MobileMenuSignOut from "../components/MobileMenuSignOut";
// Imports

const SectionsDashboard = () => {
  const [sectionName, setSectionName] = useState("");
  const { user, isLoading, setIsLoading, sections, setSections } =
    useContext(AuthContext);
  // States

  let collectionRef = collection(db, "users", user.uid, "sections");

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collectionRef, (snapshot) =>
      setSections(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );

    return unsubscribe;
  }, [user]);

  const handleAddSection = async () => {
    if (!sectionName) return;
    try {
      setIsLoading(true);
      await addDoc(collectionRef, {
        sectionName,
        createdAt: new Date(),
      });
      setIsLoading(false);
      setSectionName("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveSection = async (docId) => {
    if (confirm("Are you sure you want to remove this section?")) {
      await deleteDoc(doc(db, "users", user.uid, "sections", docId));
    }
  };

  return (
    <div className="bg-white w-full md:w-[80%]  min-h-screen md:min-h-[80vh] mt-10 m-auto p-7 md:p-12 shadow-md rounded-2xl">
      <MobileMenuSignOut />

      <div className="flex flex-col gap-10">
        <h1 className="text-5xl text-center font-header">Sections</h1>
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="text" className="text-zinc-500">
              Section
            </label>
            <input
              type="text"
              placeholder="Enter Section"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className="w-full md:w-lg bg-zinc-300 p-3.5 rounded-lg focus:outline-none"
            />
          </div>
          <Button
            btnText={"Add Section"}
            isGray={false}
            handleBtnClick={handleAddSection}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {isLoading ? (
            <Loading />
          ) : (
            sections.map(({ sectionName, createdAt, id }) => (
              <div
                className="bg-white border border-zinc-300 shadow-sm p-3 relative hover:shadow-lg cursor-pointer transition duration-200 ease-in-out flex flex-col gap-3.5"
                key={id}
              >
                <h1 className="text-lg">{sectionName}</h1>
                <p className="text-sm">
                  Date Created: {createdAt?.toDate().toLocaleString()}
                </p>
                <Link to={`/sections/${id}`} className="text-green-500">
                  View Section
                </Link>
                <HiOutlineXMark
                  className="size-6 absolute top-3 right-3 z-30"
                  onClick={() => handleRemoveSection(id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionsDashboard;
