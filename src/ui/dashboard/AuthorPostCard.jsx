import bucketService from "../../services/bucketService";
import { Edit, Trash } from "lucide-react";
import DeletePostModal from "../DeletePostModal";
import { useState } from "react";
import { Link } from "react-router";

export default function AuthorPostCard({ post }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  console.log(post);
  return (
    <div className="bg-[#95a5a6] rounded-lg shadow-md  overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/blog/${post.$id}`}>
        <img
          src={bucketService.getFilePreview(post.featuredImage)}
          alt={post.title}
          className="w-full h-64 object-center"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap  mb-3 justify-between">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-gray-600 bg-gray-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}

          <div className="flex items-center space-x-4">
            <span className="text-sm">❤️ {post.likes_count} </span>
            <span className="text-sm">💬 2</span>
          </div>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
          <Link to={`/blog/${post.$id}`}>{post.title}</Link>
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Published on : {formatDate(post.$createdAt)}
          </span>
          <div className="flex gap-2">
           <Link to={`/edit/${post.$id}`}> <button className="text-blue-600 hover:text-blue-700 px-2 py-1 rounded border border-blue-600 hover:border-blue-700 transition-colors" >
              <Edit size={22} />
            </button>
              </Link>
            <button
              className="text-red-600 hover:text-red-700 px-2 py-1 rounded border border-red-600 hover:border-red-700 transition-colors"
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
          postId={post.$id}
          fileId={post.featuredImage}
        />
      )}
    </div>
  );
}
