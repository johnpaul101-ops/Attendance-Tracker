import { useContext, useState } from "react";
import Print from "../components/Print";
import StudentInfoInput from "../components/StudentInfoInput";
import Button from "../components/Button";
import AddStudentContext from "../contexts/AddStudentContext";
import { useParams } from "react-router-dom";
import moment from "moment/moment";
const Report = () => {
  const submitAttendanceReportInfo = () => {
    setAdviserName(adviser);
    setInstitutionName(institution);
  };
  const [adviser, setAdviser] = useState("");
  const [institution, setInstitution] = useState("");
  const {
    getStudentBySection,
    adviserName,
    setAdviserName,
    setInstitutionName,
  } = useContext(AddStudentContext);
  const { sectionId } = useParams();
  let students = getStudentBySection(sectionId);
  let date = moment().format("MMMM Do YYYY");

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
        <StudentInfoInput
          type={"text"}
          labelText={"Organization Name *"}
          placeHolderText={"Enter organization name"}
          value={institution}
          handleInputChange={(e) => setInstitution(e.target.value)}
        />
        <Button
          btnText={"Submit"}
          handleBtnClick={submitAttendanceReportInfo}
        />
      </div>

      <Print students={students} adviserName={adviserName} date={date} />
    </>
  );
};

export default Report;
