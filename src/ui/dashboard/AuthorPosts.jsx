import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAuthorPosts } from "../../store/fetchPostSlice";
import Loader from "../Loader";
import AuthorPostCard from "./AuthorPostCard";

export default function AuthorPosts() {
  const { authorPosts, loading, error } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    dispatch(fetchAuthorPosts(currentPage));
  }, [dispatch, currentPage]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load posts: {error}</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-200">My Posts</h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {authorPosts.map((post) => (
          <AuthorPostCard post={post} key={post.$id} />
        ))}
      </main>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </section>
  );
}
