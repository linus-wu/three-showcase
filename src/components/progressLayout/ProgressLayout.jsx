const ProgressLayout = ({ loadingPercentage }) => {
  return (
    <div className="absolute top-16 left-0 w-full h-full flex justify-center items-center bg-black z-50">
      <div className="w-9/12">
        <div
          className="bg-blue-950 h-2 rounded-lg"
          style={{ width: `${loadingPercentage}%` }}
        />
        <div className="text-2xl text-center text-slate-300 mt-3">
          {loadingPercentage} %
        </div>
      </div>
    </div>
  );
};

export default ProgressLayout;
