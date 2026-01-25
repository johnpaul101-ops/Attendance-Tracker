import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import AuthContext from "./AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
export const AddStudentContext = createContext();

export const AddStudentContextProvider = ({ children }) => {
  const [studentInfo, setStudentInfo] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [currentSection, setCurrentSection] = useState(() => {
    const data = localStorage.getItem("currentSection");
    return data ? JSON.parse(data) : "";
  });
  const [adviserName, setAdviserName] = useState("");
  // State Contexts

  const { user, setIsLoading } = useContext(AuthContext);
  const getStudentBySection = useCallback(
    (sectionId) => {
      return studentInfo[sectionId] || [];
    },
    [studentInfo],
  );
  let studentsPerSection = getStudentBySection(currentSection) || [];

  useEffect(() => {
    if (currentSection) {
      localStorage.setItem("currentSection", JSON.stringify(currentSection));
    }
  }, [currentSection]);

  useEffect(() => {
    if (!user || !currentSection) return;
    let collectionRef = collection(
      db,
      "users",
      user.uid,
      "sections",
      currentSection,
      "students",
    );
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      setStudentInfo((prev) => ({
        ...prev,
        [currentSection]: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      }));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, currentSection]);

  const getFilteredListData = useCallback(
    (sectionId) => {
      const students = getStudentBySection(sectionId);
      if (!searchInput) return students;

      return students.filter((student) => {
        const fullName = `${student.fullName}`.toLowerCase().trim();
        const status = `${student.status}`.toLowerCase().trim();
        return (
          fullName.includes(searchInput.toLowerCase()) ||
          status.includes(searchInput.toLowerCase())
        );
      });
    },
    [studentInfo, searchInput],
  );

  const stats = useMemo(() => {
    return {
      total: studentsPerSection.length,
      present: studentsPerSection.filter((s) => s.status === "present").length,
      late: studentsPerSection.filter((s) => s.status === "late").length,
      absent: studentsPerSection.filter((s) => s.status === "absent").length,
    };
  }, [studentsPerSection]);

  const { total, present, late, absent } = stats;
  return (
    <AddStudentContext.Provider
      value={{
        studentInfo,
        setStudentInfo,
        present,
        late,
        absent,
        total,
        searchInput,
        setSearchInput,
        getStudentBySection,
        getFilteredListData,
        studentsPerSection,
        setCurrentSection,
        currentSection,
        adviserName,
        setAdviserName,
      }}
    >
      {children}
    </AddStudentContext.Provider>
  );
};

export default AddStudentContext;
