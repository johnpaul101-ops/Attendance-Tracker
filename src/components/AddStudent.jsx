import StudentInfoInput from "../components/StudentInfoInput";
import Button from "../components/Button";
import { useContext, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import AuthContext from "../contexts/AuthContext";
import { db } from "../config/firebase";
import { useParams } from "react-router-dom";

const AddStudent = () => {
  const [studentFullName, setStudentFullName] = useState("");
  const [studentGender, setStudentGender] = useState("");
  const { sectionId } = useParams();
  const { user, setIsLoading } = useContext(AuthContext);
  let collectionRef = collection(
    db,
    "users",
    user.uid,
    "sections",
    sectionId,
    "students",
  );

  const handleAddStudent = async () => {
    let removeWhiteSpace = studentFullName.trim();
    if (!removeWhiteSpace || !studentGender) return;

    try {
      await addDoc(collectionRef, {
        fullName: removeWhiteSpace,
        gender: studentGender,
        status: "none",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setStudentFullName("");
      setStudentGender("");
      setIsLoading(false);
    }
  };

  const handleClearInputs = () => {
    setStudentFullName("");
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
              labelText={"Full Name *"}
              placeHolderText={"Enter Student Full Name"}
              value={studentFullName}
              handleInputChange={(e) => setStudentFullName(e.target.value)}
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
