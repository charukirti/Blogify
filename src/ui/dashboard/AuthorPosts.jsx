import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAuthorPosts } from "../../store/fetchPostSlice";
import { Link } from "react-router";
import Loader from "../Loader";

import AuthorPostCard from "./AuthorPostCard";
export default function AuthorPosts() {
  const { authorPosts, loading, error } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthorPosts());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-200">My Posts</h1>
        <Link
          to={"/create"}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Post
        </Link>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {authorPosts.map((post) => (
          <AuthorPostCard post={post} key={post.$id} />
        ))}
      </main>
    </section>
  );
}
