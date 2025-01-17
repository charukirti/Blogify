import { useEffect, useState } from "react";
import { databases } from "../../services/appwrite";
import conf from "../../conf/conf";
import { Query } from "appwrite";
import { Link } from "react-router";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResult] = useState([]);

  function handleSearchQuery(e) {
    setSearchQuery(e.target.value);
  }

  async function handleSearch(query) {
    if (query.lenght === 0) return;

    try {
      const data = await databases.listDocuments(
        conf.appDatabaseID,
        conf.blogsCollectionID,
        [
          Query.search("title", query),
          Query.search("content", query),
          Query.limit(5),
        ],
      );

      setResult(data.documents);
    } catch (error) {
      console.log("There was an error while searching", error);
      setResult([]);
    }
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  return (
    <div className="relative">
      <div className="mx-auto hidden max-w-md overflow-hidden rounded-full border border-slate-800 bg-white px-1 py-2 md:flex">
        <input
          type="email"
          placeholder="Search Something..."
          value={searchQuery}
          onChange={handleSearchQuery}
          className="w-full bg-white pl-4 text-sm outline-none"
        />
      </div>

      {results.length > 0 && searchQuery && (
        <div className="absolute mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto">
            {results.map((result) => (
              <li
                key={result.$id}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              >
                <Link to={`blog/${result.$id}`}> {result.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
