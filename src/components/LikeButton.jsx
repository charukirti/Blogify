import { ThumbsDown, ThumbsUp } from "lucide-react";

export default function LikeButton({
  hasLiked,
  handleToggleLike,
  likesCount,
  id,
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="flex items-center gap-2 rounded text-gray-200 hover:bg-gray-600"
        onClick={handleToggleLike}
      >
        {hasLiked[id] ? (
          <ThumbsUp className="h-5 w-5 text-green-500" />
        ) : (
          <ThumbsUp className="h-5 w-5 text-white" />
        )}
      </button>
      <span className="text-sm font-semibold text-gray-300 lg:text-lg">
        {likesCount[id]}
      </span>
    </div>
  );
}
