const StudentsStatusCard = ({ icon, bgColor, totalNum, status }) => {
  return (
    <div className={`${bgColor} flex gap-3.5 items-center p-4 w-64 max-w-72`}>
      <div className="p-2 bg-white rounded-lg">{icon}</div>
      <div className="flex flex-col text-slate-950 gap-1">
        <h1 className="text-2xl font-medium">{totalNum}</h1>
        <p className="text-sm">{status}</p>
      </div>
    </div>
  );
};

export default StudentsStatusCard;
