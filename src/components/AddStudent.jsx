import StudentInfoInput from "../components/StudentInfoInput";
import Button from "../components/Button";
import { useContext, useState } from "react";
import AddStudentContext from "../contexts/AddStudentContext";
import moment from "moment";
const AddStudent = () => {
  const { setStudentInfo } = useContext(AddStudentContext);
  const [studentName, setStudentName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentMiddleName, setStudentMiddleName] = useState("");

  const [studentGender, setStudentGender] = useState("");

  const handleAddStudent = () => {
    const newStudentInfo = {
      id: Date.now(),
      name: studentName,
      lastName: studentLastName,
      middleName: studentMiddleName,
      gender: studentGender,
      status: "none",
      time: "",
    };

    if (studentName && studentLastName && studentGender) {
      setStudentInfo((prev) => [...prev, newStudentInfo]);
      setStudentName("");
      setStudentLastName("");
      setStudentMiddleName("");
      setStudentGender("");
    }
  };

  const handleClearInputs = () => {
    setStudentName("");
    setStudentLastName("");
    setStudentMiddleName("");
    setStudentGender("");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-14 bg-white p-4 md:p-6 shadow-md rounded-xl">
        <h1 className="font-header text-slate-950 text-2xl md:text-3xl">
          Add Student
        </h1>

        <div className="flex flex-col gap-4">
          <h1 className="font-header text-slate-950 text-xl md:2xl">
            Student Information:
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
            <StudentInfoInput
              type={"text"}
              labelText={"First Name *"}
              placeHolderText={"Enter Student First Name"}
              value={studentName}
              handleInputChange={(e) => setStudentName(e.target.value)}
            />
            <StudentInfoInput
              type={"text"}
              labelText={"Middle Name *"}
              placeHolderText={"Enter Student Middle Name"}
              value={studentMiddleName}
              handleInputChange={(e) => setStudentMiddleName(e.target.value)}
            />
            <StudentInfoInput
              type={"text"}
              labelText={"Last Name *"}
              placeHolderText={"Enter Student Last Name"}
              value={studentLastName}
              handleInputChange={(e) => setStudentLastName(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="checkbox" className="text-zinc-400">
                Gender *
              </label>
              <div className="flex gap-3.5">
                <div className="flex gap-1.5 items-center">
                  <label htmlFor="checkbox">Male</label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={studentGender === "male"}
                    onChange={(e) => setStudentGender(e.target.value)}
                  />
                </div>
                <div className="flex gap-1.5 items-center">
                  <label htmlFor="checkbox">Female</label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={studentGender === "female"}
                    onChange={(e) => setStudentGender(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 self-center lg:self-start">
        <Button handleBtnClick={handleAddStudent} btnText={"Add Student"} />
        <Button
          btnText={"Cancel"}
          isGray={true}
          handleBtnClick={handleClearInputs}
        />
      </div>
    </div>
  );
};

export default AddStudent;
