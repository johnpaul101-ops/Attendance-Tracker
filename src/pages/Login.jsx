import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInUser, signInWithGoogle, user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await signInUser(email, password);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSignWithGoogle = async () => {
    setErrorMessage("");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-zinc-300 px-3 md:p-0">
      <form
        action=""
        onSubmit={handleFormSubmit}
        className="bg-white shadow-lg py-6 p-3 md:px-9 rounded-2xl flex flex-col items-center gap-9 w-full lg:w-xl md:w-[70%]"
      >
        <h1 className="text-2xl font-header">Sign In</h1>

        {errorMessage ? (
          <p className="bg-red-400 p-4 border border-red-100 w-full text-center">
            {errorMessage}
          </p>
        ) : (
          ""
        )}

        <div className="flex flex-col gap-9 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white p-3 rounded-2xl border shadow-md border-zinc-300 focus:outline-none"
              placeholder="Enter your Email"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white p-3 rounded-2xl border shadow-md border-zinc-300 focus:outline-none"
              placeholder="Enter your Password"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            type="submit"
            className="w-full bg-green-500 p-3 rounded-2xl text-white cursor-pointer text-lg font-body-text font-medium"
          >
            Sign In
          </button>
          <button
            className="w-full bg-white p-3 rounded-2xl border shadow-md border-zinc-300 cursor-pointer flex items-center justify-center gap-5 text-lg font-body-text font-medium"
            onClick={handleSignWithGoogle}
          >
            <img src={googleLogo} alt="Google" className="w-9" />
            Sign In With Google
          </button>
        </div>

        <p>
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-green-500 underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
