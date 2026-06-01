const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="🔍 Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-3 border rounded-xl shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SearchBar;