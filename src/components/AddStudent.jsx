import StudentInfoInput from "../components/StudentInfoInput";
import Button from "../components/Button";
import { useContext, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import AuthContext from "../contexts/AuthContext";
import { db } from "../config/firebase";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import imageReference from "../assets/reference.png";
import { HiOutlineXMark } from "react-icons/hi2";
const AddStudent = () => {
  const [studentFullName, setStudentFullName] = useState("");
  const [studentGender, setStudentGender] = useState("");
  const [fileName, setFileName] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const { sectionId } = useParams();
  const { user, setIsLoading } = useContext(AuthContext);
  const [refImage, setRefImage] = useState(false);
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
      setIsLoading(true);
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
  const handleUploadExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const normalizedData = jsonData.map((row) => {
      return Object.keys(row).reduce((acc, key) => {
        acc[key.toLowerCase().trim()] = row[key];
        return acc;
      }, {});
    });

    setStudentsList(normalizedData);
  };

  const handleBulkUpload = async () => {
    if (studentsList.length === 0) {
      console.error("No students found");
      return;
    }

    try {
      const uploads = studentsList.map((student) => {
        return addDoc(collectionRef, {
          fullName: student.name,
          gender: `${student.gender}`.toLowerCase(),
          status: "none",
          createdAt: new Date(),
        });
      });

      await Promise.all(uploads);
    } catch (error) {
      console.error(error);
    } finally {
      setFileName("");
    }
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-14 bg-white p-4 md:p-6 shadow-md rounded-xl">
        <h1 className="font-header text-slate-950 text-2xl md:text-3xl">
          Add Student
        </h1>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-15">
            <div className="flex flex-col gap-6">
              <h1 className="font-header text-slate-950 text-xl md:2xl">
                Student Information:
              </h1>
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
                <div className="flex gap-4 self-center lg:self-start">
                  <Button
                    handleBtnClick={handleAddStudent}
                    btnText={"Add Student"}
                  />
                  <Button
                    btnText={"Cancel"}
                    isGray={true}
                    handleBtnClick={handleClearInputs}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="font-header text-slate-950 text-xl md:2xl">
                Upload Excel File:
              </h1>
              <div className="flex flex-col gap-3 items-start mt-3 md:mt-5">
                <label
                  htmlFor="file"
                  className="bg-gray-200 p-2 rounded-2xl font-body-text cursor-pointer hover:bg-black/5"
                >
                  Upload Excel File
                </label>
                <input
                  type="file"
                  id="file"
                  hidden
                  onChange={(e) => handleUploadExcel(e)}
                />
                <p>File: {fileName}</p>
                <p className="text-red-400">
                  <strong>Note:</strong> Please ensure your Excel file includes
                  a header row as the first line (Row 1). The file must contain
                  columns specifically labeled <strong>"Name"</strong> and{" "}
                  <strong>"Gender"</strong> to be processed correctly. For
                  reference{" "}
                  <span
                    className="underline cursor-pointer"
                    onClick={() => setRefImage(true)}
                  >
                    Click here
                  </span>
                </p>
              </div>
              <Button
                handleBtnClick={handleBulkUpload}
                btnText={"Upload Student List"}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-full h-screen bg-black/75 fixed top-0 right-0 z-50 ${refImage ? "flex" : "hidden"} items-center justify-center`}
      >
        <HiOutlineXMark
          size={40}
          className="absolute text-white top-10 right-10 cursor-pointer"
          onClick={() => setRefImage(false)}
        />
        <img src={imageReference} alt="Excel Reference" />
      </div>
    </div>
  );
};

export default AddStudent;
