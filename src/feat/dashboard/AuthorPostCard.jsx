import { useEffect, useState } from "react";
import { Link } from "react-router";
import bucketService from "../../services/bucketService";
import DeletePostModal from "./DeletePostModal";
import { Edit, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchViews } from "../../store/interactionsSlice";

export default function AuthorPostCard({ post }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const viewsCount = useSelector(
    (state) => state.interactions.viewsCount[post.$id] || 0,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchViews(post.$id));
  }, [dispatch, post.$id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  function handleDelete(e) {
    setShowDeleteModal(true);
  }

  return (
    <div className="overflow-hidden rounded-lg bg-[#95a5a6] shadow-md transition-shadow hover:shadow-lg">
      <Link to={`/blog/${post.$id}`}>
        <img
          src={bucketService.getFilePreview(post.featuredImage)}
          alt={post.title}
          className="w-full object-center lg:h-64"
        />
      </Link>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap justify-between sm:gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-1 text-gray-600"
            >
              {tag}
            </span>
          ))}

          <div className="flex items-center space-x-1 lg:space-x-4">
            <span className="text-sm">❤️ {post.likes_count || 0} </span>
            <span className="text-sm">💬 {post.comments_count || 0}</span>
            <span className="text-sm">👀 {viewsCount || 0}</span>
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900 lg:text-2xl">
          <Link to={`/blog/${post.$id}`}>{post.title}</Link>
        </h2>
        <p className="mb-4 line-clamp-3 text-gray-600">{post.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Published on : {formatDate(post.$createdAt)}
          </span>
          <div className="flex gap-2">
            <Link to={`/edit/${post.$id}`}>
              <button className="rounded border border-blue-600 px-2 py-1 text-blue-600 transition-colors hover:border-blue-700 hover:text-blue-700">
                <Edit size={22} />
              </button>
            </Link>
            <button
              className="rounded border border-red-600 px-2 py-1 text-red-600 transition-colors hover:border-red-700 hover:text-red-700"
              onClick={handleDelete}
            >
              <Trash size={22} />
            </button>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeletePostModal
          handleShowDeleteModal={setShowDeleteModal}
          post={post}
        />
      )}
    </div>
  );
}
