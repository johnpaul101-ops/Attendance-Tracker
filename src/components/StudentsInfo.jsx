import { useContext, useEffect } from "react";
import AddStudentContext from "../contexts/AddStudentContext";
import { HiOutlineXMark } from "react-icons/hi2";
const StudentsInfo = () => {
  const {
    studentInfo,
    setStudentInfo,
    searchInput,
    filteredList,
    setfilteredList,
  } = useContext(AddStudentContext);

  studentInfo.sort((a, b) => a.lastName.localeCompare(b.lastName));

  const handleRemoveStudent = (id, name) => {
    if (confirm(`Are you sure you want to remove ${name} in this list?`)) {
      const removeStudent = studentInfo.filter((student) => student.id !== id);
      setStudentInfo(removeStudent);
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-md p-2 md:p-6 rounded-xl">
      <table>
        <thead>
          <tr className="border-b border-b-zinc-300">
            <td className="font-body-text font-medium md:text-lg pb-3">Name</td>
            <td className="font-body-text font-medium md:text-lg pb-3">
              Gender
            </td>
          </tr>
        </thead>

        <tbody>
          {filteredList.map(({ id, name, lastName, middleName, gender }) => (
            <tr className="border-b border-b-zinc-300" key={id}>
              <td className="py-3 text-sm md:text-[1rem] text-zinc-600 capitalize">
                {lastName}, {name} {middleName}
              </td>
              <td className="py-3 text-sm md:text-[1rem] text-zinc-600 capitalize">
                {gender}
              </td>

              <td className="flex justify-center py-3">
                <HiOutlineXMark
                  className="size-4 lg:size-6 cursor-pointer"
                  onClick={() => handleRemoveStudent(id, name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsInfo;
