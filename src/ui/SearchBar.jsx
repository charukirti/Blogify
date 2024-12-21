export default function SearchBar() {
  return (
    <div className="bg-white flex px-1 py-2 rounded-full border border-slate-800 overflow-hidden max-w-md mx-auto font-[sans-serif]">
      <input
        type="email"
        placeholder="Search Something..."
        className="w-full outline-none bg-white pl-4 text-sm"
      />
     
    </div>
  );
}
