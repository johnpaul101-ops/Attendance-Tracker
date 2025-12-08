import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AttendanceContextProvider } from "./contexts/UIContext.jsx";
import { AddStudentContextProvider } from "./contexts/AddStudentContext.jsx";
createRoot(document.getElementById("root")).render(
  <AddStudentContextProvider>
    <AttendanceContextProvider>
      <App />
    </AttendanceContextProvider>
  </AddStudentContextProvider>
);
