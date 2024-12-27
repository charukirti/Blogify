import { Link } from "react-router";
import bucketService from "../../services/bucketService";

export default function BlogCard({ post }) {
  console.log(post);
  const {
    title,
    description,
    featuredImage,
    $createdAt,
    updatedAt,
    likes = 0,
    comments = 0,
  } = post;

  return (
    <div className="bg-[#95a5a6]  p-4 rounded-lg shadow-lg hover:shadow-xl transition w-max">
      <Link to={`/blog/${post.$id}`}>
        <img
          src={bucketService.getFilePreview(featuredImage)}
          alt={title}
          className="w-full h-64 object-cover rounded-lg"
        />
      </Link>

      <div className="p-4">
        <Link to={`/blog/${post.$id}`}>
          <h2 className="text-[#ffffff] text-2xl font-semibold">{title}</h2>
        </Link>

        <p className="text-[#ffffff] text-sm mt-2 line-clamp-3">
          {description}
        </p>

        <div className="flex justify-between items-center text-[#ffffff] text-xs mt-4">
          <div className="space-x-2">
            <span>Created: {new Date($createdAt).toLocaleDateString()}</span>
            {updatedAt && (
              <span className="before:content-['•'] before:mx-2">
                Updated: {new Date(updatedAt).toLocaleDateString()}
              </span>
            )}
            <span>by {post.author?.name || 'Anonymous'}</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>❤️ {likes}</span>
            <span>💬 {comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
