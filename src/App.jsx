import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Report from "./pages/Report.jsx";
import Attendance from "./pages/Attendance.jsx";
import Students from "./pages/Students.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />}></Route>
          <Route path="/students" element={<Students />}></Route>
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/report" element={<Report />}></Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
