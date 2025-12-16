import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const SignOutButton = ({ isHidden }) => {
  let navigate = useNavigate();
  const handleLogOutUser = async () => {
    await signOut(auth);
    localStorage.removeItem("userData");
    navigate("/login");
    setToggleSidebar(false);
  };
  return (
    <button
      onClick={handleLogOutUser}
      className={`bg-green-400 text-white hover:bg-green-400/70 p-3.5 cursor-pointer rounded-lg text-lg transition-all duration-200 ease-in-out w-full lg:w-72 ${
        isHidden ? "hidden" : "block"
      } lg:block`}
    >
      Log Out
    </button>
  );
};

export default SignOutButton;
