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
        ]
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
      <div className="hidden bg-white md:flex px-1 py-2 rounded-full border border-slate-800 overflow-hidden max-w-md mx-auto ">
        <input
          type="email"
          placeholder="Search Something..."
          value={searchQuery}
          onChange={handleSearchQuery}
          className="w-full outline-none bg-white pl-4 text-sm"
        />
      </div>

      {
        results.length > 0 && searchQuery && (
          <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
            <ul className="max-h-60 overflow-auto">
              {
                results.map((result) => (
                  <li key={result.$id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" >
                    <Link to={`blog/${result.$id}`}> {result.title}</Link>
                  </li>
                ))
              }
            </ul>
          </div>
        )
      }
    </div>
  );
}
