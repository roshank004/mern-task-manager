const StatsCards = ({ total, completed, pending }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-blue-500 text-white p-5 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold">Total Tasks</h3>
        <p className="text-3xl font-bold">{total}</p>
      </div>

      <div className="bg-green-500 text-white p-5 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold">Completed</h3>
        <p className="text-3xl font-bold">{completed}</p>
      </div>

      <div className="bg-orange-500 text-white p-5 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold">Pending</h3>
        <p className="text-3xl font-bold">{pending}</p>
      </div>
    </div>
  );
};

export default StatsCards;