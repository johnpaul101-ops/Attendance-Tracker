import { createContext, useState, useEffect } from "react";

export const AddStudentContext = createContext();

export const AddStudentContextProvider = ({ children }) => {
  const [studentInfo, setStudentInfo] = useState(() => {
    const savedDataInLocalStorage = localStorage.getItem("studentData");

    return savedDataInLocalStorage ? JSON.parse(savedDataInLocalStorage) : [];
  });
  const [searchInput, setSearchInput] = useState("");
  const [filteredList, setfilteredList] = useState([]);
  // State Contexts

  useEffect(() => {
    localStorage.setItem("studentData", JSON.stringify(studentInfo));
  }, [studentInfo]);

  useEffect(() => {
    if (!searchInput) {
      setfilteredList(studentInfo);
    } else {
      const searchStudent = studentInfo.filter((student) =>
        `${student.name} ${student.lastName}`
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
      setfilteredList(searchStudent);
    }
  }, [searchInput, studentInfo]);

  const presentCount = studentInfo.filter(
    (student) => student.status === "present"
  ).length;
  const lateCount = studentInfo.filter(
    (student) => student.status === "late"
  ).length;
  const absentCount = studentInfo.filter(
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
        searchInput,
        setSearchInput,
        filteredList,
        setfilteredList,
      }}
    >
      {children}
    </AddStudentContext.Provider>
  );
};

export default AddStudentContext;
