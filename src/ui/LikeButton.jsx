import { ThumbsDown, ThumbsUp } from "lucide-react";

export default function LikeButton({
  hasLiked,
  handleToggleLike,
  likesCount,
  id,
}) {
  return (
    <div className=" flex items-center gap-2">
      <button
        className="flex items-center gap-2  rounded text-gray-200 hover:bg-gray-600"
        onClick={handleToggleLike}
      >
        {hasLiked[id] ? (
          <ThumbsUp className="w-5 h-5 text-green-500" />
        ) : (
          <ThumbsUp className="w-5 h-5 text-white" />
        )}
      </button>
      <span className="text-sm lg:text-lg font-semibold text-gray-300">
        {likesCount[id]}
      </span>
    </div>
  );
}
