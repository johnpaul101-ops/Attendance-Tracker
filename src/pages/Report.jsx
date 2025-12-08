import { useContext, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import AddStudentContext from "../contexts/AddStudentContext";
import moment from "moment/moment";
import StudentInfoInput from "../components/StudentInfoInput";
import Button from "../components/Button";
import { IoIosPrint } from "react-icons/io";

const Report = () => {
  const { studentInfo } = useContext(AddStudentContext);
  const [section, setSection] = useState("");
  const [adviser, setAdviser] = useState("");
  const [studentsSection, setStudentsSection] = useState("");
  const [adviserName, setAdviserName] = useState("");

  let date = moment().format("MMMM Do YYYY");

  const submitAttendanceReportInfo = () => {
    setAdviserName(adviser);
    setStudentsSection(section);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 bg-white w-full lg:w-[80%] mb-12 p-4 lg:p-7 gap-9 rounded-lg shadow-md print:hidden">
        <StudentInfoInput
          type={"text"}
          labelText={"Section *"}
          placeHolderText={"Enter your section"}
          value={section}
          handleInputChange={(e) => setSection(e.target.value)}
        />
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
      <div className="bg-white w-full lg:w-[80%] min-h-screen p-4 lg:p-7 rounded-lg shadow-md relative print:hidden ">
        <IoIosPrint
          className="size-6 mb-10 absolute right-8 cursor-pointer"
          onClick={() => window.print()}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 mt-12 ">
          <div className="flex flex-col gap-2.5 text-center sm:text-start">
            <h1 className="font-bold uppercase">
              La Consolacion University Philippines
            </h1>
            <h1 className="font-bold uppercase">Section: {studentsSection}</h1>
          </div>
          <div className="flex flex-col gap-2.5 text-center sm:text-start">
            <h1 className="font-bold uppercase">Date: {date}</h1>
            <h1 className="font-bold uppercase">Adviser: {adviserName}</h1>
          </div>
        </div>

        <table className="hidden sm:block">
          <thead>
            <tr className="border-b border-b-zinc-300">
              <td className="text-lg pb-3 w-52 uppercase font-medium text-center">
                Student No.
              </td>
              <td className="text-lg pb-3 w-96 uppercase font-medium text-center">
                Name
              </td>
              <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                Status
              </td>
              <td className="text-lg pb-3 w-80 uppercase font-medium text-center">
                Time
              </td>
            </tr>
          </thead>

          <tbody>
            {studentInfo.map(
              ({ id, name, lastName, middleName, status, time }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-lg py-3 w-52 text-center">{i + 1}</td>
                  <td className="text-lg py-3 w-96 text-center">
                    {`${lastName}, ${name} ${middleName}`.toUpperCase()}
                  </td>
                  <td className="text-lg py-3 w-80 text-center">
                    {status.toUpperCase()}
                  </td>
                  <td className="text-lg py-3 w-86 text-center uppercase">
                    {time}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Smaller Screen Below */}
        <div className="flex flex-col gap-3.5 sm:hidden">
          {studentInfo.map(
            ({ id, name, lastName, middleName, status, time }, i) => (
              <div
                className="bg-zinc-300 p-3 rounded-lg shadow-md flex flex-col gap-2.5"
                key={i}
              >
                <h1 className="uppercase">
                  <b>Student No. : </b>
                  {i + 1}
                </h1>

                <h1 className="uppercase">
                  <b>Name: </b>
                  {`${lastName}, ${name} ${middleName}`.toUpperCase()}
                </h1>
                <h1 className="uppercase">
                  <b>Status: </b>
                  {status}
                </h1>
                <h1 className="uppercase">
                  <b>Time: </b>
                  {time}
                </h1>
              </div>
            )
          )}
        </div>
      </div>

      {/* Print Format */}
      <div className="bg-white w-full h-[297mm] p-[10mm]  hidden print:block">
        <div className="flex  justify-between mb-12">
          <div className="flex flex-col gap-2.5">
            <h1 className="font-bold uppercase">
              La Consolacion University Philippines
            </h1>
            <h1 className="font-bold uppercase">Section: {studentsSection}</h1>
          </div>
          <div className="flex flex-col gap-2.5">
            <h1 className="font-bold uppercase">Date: {date}</h1>
            <h1 className="font-bold uppercase">Adviser: {adviserName}</h1>
          </div>
        </div>

        <table>
          <thead>
            <tr className="border-b border-b-zinc-300">
              <td className="text-lg pb-3 w-64 uppercase font-medium text-center">
                Student No.
              </td>
              <td className="text-lg pb-3 w-lg uppercase font-medium text-center">
                Name
              </td>
              <td className="text-lg pb-3 w-lg uppercase font-medium text-center">
                Status
              </td>
              <td className="text-lg pb-3 w-56 uppercase font-medium text-center">
                Time
              </td>
            </tr>
          </thead>

          <tbody>
            {studentInfo.map(
              ({ id, name, lastName, middleName, status, time }, i) => (
                <tr className="border-b border-b-zinc-300" key={id}>
                  <td className="text-lg py-3 w-32 text-center">{i + 1}</td>
                  <td className="text-lg py-3 w-72 text-center">
                    {`${lastName}, ${name} ${middleName}`.toUpperCase()}
                  </td>
                  <td className="text-lg py-3 w-40 text-center">
                    {status.toUpperCase()}
                  </td>
                  <td className="text-lg py-3 w-36 text-center uppercase">
                    {time}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Report;
