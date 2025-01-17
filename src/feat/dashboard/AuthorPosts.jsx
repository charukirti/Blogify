import { useDispatch, useSelector } from "react-redux";
import { lazy, Suspense, useEffect } from "react";
import { fetchAuthorPosts } from "../../store/fetchPostSlice";
import { Link } from "react-router";
import Loader from "../../components/Loader";

const AuthorPostCard = lazy(() => import("./AuthorPostCard"));
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
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-200 lg:text-3xl">
          My Posts
        </h1>
        <Link
          to={"/create"}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </header>

      <main className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {authorPosts.map((post) => (
          <Suspense fallback={<Loader />} key={post.$id}>
            <AuthorPostCard post={post} />
          </Suspense>
        ))}
      </main>
    </section>
  );
}
