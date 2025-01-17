import { Link } from "react-router";
import bucketService from "../../services/bucketService";
import { useMemo, memo } from "react";
const BlogCard = memo(function BlogCard({ post }) {
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
    [featuredImage],
  );

  return (
    <article className="w-full rounded-lg bg-[#95a5a6] p-2 shadow-lg transition hover:shadow-xl lg:w-[768px]">
      <Link to={`/blog/${post.$id}`}>
        <img
          src={imgUrl}
          alt={title}
          className="w-full rounded-lg object-fill lg:h-96"
        />
        <div className="p-2">
          <h2 className="text-xl font-semibold text-[#ffffff]">{title}</h2>
          <p className="mt-2 line-clamp-3 text-sm text-[#ffffff]">
            {description}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#ffffff]">
            <div className="g flex flex-col">
              <span className="lg:text-sm">
                Published on: {new Date($createdAt).toLocaleDateString()}
              </span>
              {updatedAt && (
                <span className="before:mx-2 before:content-['•']">
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
      </Link>
    </article>
  );
});

export default BlogCard;
