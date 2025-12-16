import { useContext, useState } from "react";
import Print from "../components/Print";
import StudentInfoInput from "../components/StudentInfoInput";
import Button from "../components/Button";
import AddStudentContext from "../contexts/AddStudentContext";
import { useParams } from "react-router-dom";

const Report = () => {
  const [adviserName, setAdviserName] = useState("");
  const submitAttendanceReportInfo = () => {
    setAdviserName(adviser);
  };
  const [adviser, setAdviser] = useState("");
  const { getStudentBySection } = useContext(AddStudentContext);
  const { sectionId } = useParams();
  let students = getStudentBySection(sectionId);

  return (
    <>
      <div className="flex flex-col   bg-white w-full lg:w-[80%] mb-12 p-4 lg:p-7 gap-9 rounded-lg shadow-md print:hidden ">
        <StudentInfoInput
          type={"text"}
          labelText={"Adviser *"}
          placeHolderText={"Enter your adviser name"}
          value={adviser}
          handleInputChange={(e) => setAdviser(e.target.value)}
        />
        <Button
          btnText={"Submit"}
          handleBtnClick={submitAttendanceReportInfo}
        />
      </div>

      <Print students={students} adviserName={adviserName} />
    </>
  );
};

export default Report;
