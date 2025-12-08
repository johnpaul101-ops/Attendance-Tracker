import AddStudent from "../components/AddStudent";
import StudentsInfo from "../components/StudentsInfo";

const Students = () => {
  return (
    <div className="flex gap-6 overflow-x-hidden">
      <div className="flex flex-col gap-6 w-full md:w-[80%]">
        <AddStudent />
        <StudentsInfo />
      </div>
    </div>
  );
};

export default Students;
