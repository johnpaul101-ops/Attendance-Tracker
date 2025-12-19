import { useContext } from "react";
import AddStudentContext from "../contexts/AddStudentContext";
import { HiOutlineXMark } from "react-icons/hi2";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import AuthContext from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
const StudentsInfo = () => {
  const { getFilteredListData, getStudentBySection } =
    useContext(AddStudentContext);
  const { user } = useContext(AuthContext);
  const { sectionId } = useParams();
  let students = getStudentBySection(sectionId);

  students.sort((a, b) => a.lastName.localeCompare(b.lastName));
  let filteredList = getFilteredListData(sectionId);

  const handleRemoveStudent = async (id, name) => {
    if (confirm(`Are you sure you want to remove ${name} in this list?`)) {
      await deleteDoc(
        doc(db, "users", user.uid, "sections", sectionId, "students", id)
      );
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
          {filteredList?.map(({ name, middleName, lastName, gender, id }) => (
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
