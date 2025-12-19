import { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export const AddStudentContext = createContext();

export const AddStudentContextProvider = ({ children }) => {
  const [studentInfo, setStudentInfo] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  // State Contexts

  const { user } = useContext(AuthContext);
  const getStudentBySection = (sectionId) => {
    return studentInfo[sectionId] || [];
  };
  let studentsPerSection = getStudentBySection(currentSection);

  useEffect(() => {
    if (!user || !currentSection) return;
    let collectionRef = collection(
      db,
      "users",
      user.uid,
      "sections",
      currentSection,
      "students"
    );
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      setStudentInfo((prev) => ({
        ...prev,
        [currentSection]: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      }));
    });

    return unsubscribe;
  }, [user, currentSection]);

  const getFilteredListData = (sectionId) => {
    const students = getStudentBySection(sectionId);

    return students.filter((student) =>
      `${student.lastName} ${student.name} ${student.middleName}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
  };

  const totalStudents = studentsPerSection.length;
  const presentCount = studentsPerSection.filter(
    (student) => student.status === "present"
  ).length;
  const lateCount = studentsPerSection.filter(
    (student) => student.status === "late"
  ).length;
  const absentCount = studentsPerSection.filter(
    (student) => student.status === "absent"
  ).length;

  return (
    <AddStudentContext.Provider
      value={{
        studentInfo,
        setStudentInfo,
        presentCount,
        lateCount,
        absentCount,
        totalStudents,
        searchInput,
        setSearchInput,
        getStudentBySection,
        getFilteredListData,
        studentsPerSection,
        setCurrentSection,
      }}
    >
      {children}
    </AddStudentContext.Provider>
  );
};

export default AddStudentContext;
