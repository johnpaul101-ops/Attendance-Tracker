const StudentInfoInput = ({
  type,
  labelText,
  placeHolderText,
  handleInputChange,
  value,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={type} className="text-zinc-400">
        {labelText}
      </label>
      <input
        type={type}
        placeholder={placeHolderText}
        required
        className="bg-zinc-300 p-3.5 rounded-xl w-80% focus:outline-none"
        onChange={handleInputChange}
        value={value}
      />
    </div>
  );
};

export default StudentInfoInput;
