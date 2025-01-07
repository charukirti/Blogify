import { Link } from "react-router";
import bucketService from "../../services/bucketService";
import { useMemo, memo } from "react";
const BlogCard = memo( function BlogCard({ post }) {
  const {
    title,
    description,
    featuredImage,
    $createdAt,
    updatedAt,
    likes_count,
    comments_count,
  } = post;

  const imgUrl = useMemo(
    () => bucketService.getFilePreview(featuredImage),
    [featuredImage]
  );

  return (
    <div className="bg-[#95a5a6]  p-2 rounded-lg shadow-lg hover:shadow-xl transition ">
      <Link to={`/blog/${post.$id}`}>
        <img
          src={imgUrl}
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

        <div className="flex justify-between  items-center text-[#ffffff] text-xs mt-4">
          <div className="flex flex-col g">
            <span className="lg:text-sm">
              Published at: {new Date($createdAt).toLocaleDateString()}
            </span>
            {updatedAt && (
              <span className="before:content-['•'] before:mx-2">
                Updated: {new Date(updatedAt).toLocaleDateString()}
              </span>
            )}
            <span className="lg:text-sm">
              by {post.author_name || "Anonymous"}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">❤️ {likes_count || 0}</span>
            <span className="text-sm">💬 {comments_count || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
})

export default BlogCard
