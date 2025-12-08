const Button = ({ handleBtnClick, isGray, btnText }) => {
  return (
    <button
      onClick={handleBtnClick}
      className={`${
        isGray
          ? "bg-gray-300 hover:bg-zinc-300/70"
          : "bg-green-400 text-white hover:bg-green-400/70"
      } p-3.5 cursor-pointer rounded-lg text-lg transition-all duration-200 ease-in-out`}
    >
      {btnText}
    </button>
  );
};

export default Button;
