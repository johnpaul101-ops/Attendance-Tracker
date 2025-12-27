import Navbar from "./components/Navbar.jsx";
import SectionsDashboard from "./pages/SectionsDashboard.jsx";

const Dashboard = () => {
  return (
    <div className="w-full min-h-dvh flex flex-col bg-zinc-100 overflow-hidden">
      <Navbar />

      <main className="w-full relative">
        <SectionsDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
