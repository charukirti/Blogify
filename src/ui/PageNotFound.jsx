import { Link } from "react-router";

export default function PageNotFound() {
  return (
    <section className="container mt-10 flex items-center flex-col gap-8 ">
      <h1 className="text-8xl font-bold  text-gray-200">Page Not Found</h1>
      <p className="text-2xl text-gray-300 ">
        The page you are looking for does not exist.
      </p>
      <p className="text-gray-300 ">Please check the URL and try again.</p>
      <span className="text-gray-300">OR</span>
      <button className="text-gray-300 text-sm lg:text-xl bg-zinc-400 px-4 py-2 rounded">
        <Link to="/">Checkout Blogs</Link>
      </button>
    </section>
  );
}
