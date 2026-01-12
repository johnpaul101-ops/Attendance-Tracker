import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Report from "./pages/Report.jsx";
import Attendance from "./pages/Attendance.jsx";
import Students from "./pages/Students.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import SignUp from "./pages/SignUp.jsx";
import Section from "./components/Section.jsx";
import AttendanceHistory from "./pages/AttendanceHistory.jsx";
import PreviousAttendance from "./components/PreviousAttendance.jsx";
import WeeklyReport from "./pages/WeeklyReport.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/sections/:sectionId/"
          element={
            <ProtectedRoutes>
              <Section />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Home />}></Route>
          <Route path="dashboard" element={<Home />}></Route>
          <Route path="students" element={<Students />}></Route>
          <Route path="attendance" element={<Attendance />} />
          <Route path="report" element={<Report />}></Route>
          <Route path="weekly-report" element={<WeeklyReport />}></Route>
          <Route
            path="attendance-history"
            element={<AttendanceHistory />}
          ></Route>

          <Route
            path="attendance-history/:attendanceId"
            element={<PreviousAttendance />}
          />
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
