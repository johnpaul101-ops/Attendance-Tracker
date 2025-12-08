import { createContext, useState, useEffect } from "react";
import moment from "moment/moment";
export const AttendanceContext = createContext();

export const AttendanceContextProvider = ({ children }) => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(moment().format("h:mm:ss a"));
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);
  return (
    <AttendanceContext.Provider
      value={{
        toggleSidebar,
        setToggleSidebar,
        time,
        setTime,
        expandSearch,
        setExpandSearch,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;
