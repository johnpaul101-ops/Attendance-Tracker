import { useContext } from "react";
import AuthContext from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "./components/Loading";

const ProtectedRoutes = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoutes;
