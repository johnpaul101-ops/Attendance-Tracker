import { useContext, useEffect } from "react";
import AddStudentContext from "../contexts/AddStudentContext";
import moment from "moment/moment";
import AttendanceContext from "../contexts/UIContext";

const Attendance = () => {
  const { setStudentInfo, filteredList } = useContext(AddStudentContext);
  const { time } = useContext(AttendanceContext);
  const handleStatusChange = (id, newStatus) => {
    setStudentInfo((prevInfo) =>
      prevInfo.map((info) =>
        info.id === id ? { ...info, status: newStatus, time: time } : info
      )
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const lateTime = moment().hour(7).minute(10).second(0);
      const resetTime = moment().hour(24).minute(59).second(59);

      setStudentInfo((prev) =>
        prev.map((student) => {
          if (student.status === "none") {
            if (now.isAfter(lateTime)) {
              return { ...student, status: "late" };
            }
          }

          if (now.isAfter(resetTime)) {
            return { ...student, status: "none" };
          }
          return student;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-xl p-3 md:p-6 w-full lg:w-[70%] flex flex-col min-h-screen">
      <table>
        <thead>
          <tr className="border-b border-b-zinc-300">
            <td className="font-body-text font-medium pb-3 text-[16px] lg:text-lg w-[60%]">
              Name
            </td>

            <td className="font-body-text font-medium pb-3 text-[16px] lg:text-lg px-2 text-center">
              Present
            </td>
            <td className="font-body-text font-medium pb-3 text-[16px] lg:text-lg px-2 text-center">
              Late
            </td>
            <td className="font-body-text font-medium pb-3 text-[16px] lg:text-lg px-2 text-center">
              Absent
            </td>
          </tr>
        </thead>

        <tbody>
          {filteredList.map(
            ({ id, name, lastName, middleName, status, time }) => (
              <tr className="border-b border-b-zinc-300" key={id}>
                <td className="py-3 font-body-text text-zinc-600 lg:text-[16px] w-[60%]">
                  {lastName}, {name} {middleName}
                </td>

                <td className="py-3 text-center">
                  <input
                    type="radio"
                    name={`status_${id}`}
                    checked={status === "present"}
                    className="size-6 bg-green-300"
                    onChange={() => handleStatusChange(id, "present")}
                  />
                </td>

                <td className="py-3 text-center">
                  <input
                    type="radio"
                    name={`status_${id}`}
                    checked={status === "late"}
                    className="size-6 bg-green-300"
                    onChange={() => handleStatusChange(id, "late")}
                  />
                </td>

                <td className="py-3 text-center">
                  <input
                    type="radio"
                    name={`status_${id}`}
                    checked={status === "absent"}
                    className="size-6 bg-green-300"
                    onChange={() => handleStatusChange(id, "absent")}
                  />
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
