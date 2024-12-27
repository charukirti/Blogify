import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../store/fetchPostSlice";
import BlogCard from "../ui/home/BlogCard";
import Loader from "../ui/Loader";

export default function Blogs() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading posts: {error}
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-200">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.$id} post={post} />
        ))}
      </div>
    </section>
  );
}
