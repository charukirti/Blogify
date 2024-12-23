export default function SearchBar() {
  return (
    <div className="hidden bg-white md:flex px-1 py-2 rounded-full border border-slate-800 overflow-hidden max-w-md mx-auto ">
      <input
        type="email"
        placeholder="Search Something..."
        className="w-full outline-none bg-white pl-4 text-sm"
      />
     
    </div>
  );
}
