import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, updateComment } from "../../store/interactionsSlice";
import interactionService from "../../services/interactionService";
import CommentForm from "./CommentForm";
import EditCommentForm from "./EditCommentForm";

export default function Comment({
  comment,
  blogId,
  currentUserId,
  userName,
  authorId,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isAuthor = authorId ? comment.user_id === authorId : false;

  const dispatch = useDispatch();

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await interactionService.removeComment(comment.$id);
      dispatch(deleteComment({ blogId, commentId: comment.$id }));
    } catch (error) {
      console.log("Error deleting comment", error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleReplySuccess() {
    setIsReplying(false);
  }

  function toggleEditing(e) {
    setIsEditing(!isEditing);
  }

  async function handleEditComment(data) {
    try {
      const updatedComment = await interactionService.editComment(
        comment.$id,
        data.content,
      );
      dispatch(
        updateComment({
          blogId,
          commentId: comment.$id,
          content: updatedComment.content,
        }),
      );
      setIsEditing(false);
    } catch (error) {
      console.log("Error editing comment:", error.message);
    }
  }

  return (
    <section
      className={`border-l-2 ${
        isAuthor ? "border-blue-500" : "border-gray-200"
      } mb-4 pl-4`}
    >
      <div className="rounded-lg bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-medium text-gray-200">{comment.username}</div>
            {isAuthor && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                Author
              </span>
            )}
          </div>
          {currentUserId === comment.user_id && (
            <div className="flex gap-4">
              <button
                className="text-red-500 hover:text-red-700 disabled:text-red-300"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={toggleEditing}
              >
                {isEditing ? "Cancel editing" : "Edit"}
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <EditCommentForm comment={comment} handleEdit={handleEditComment} />
        ) : (
          <p className="m-2 text-gray-200">{comment.content}</p>
        )}

        {!isEditing && (
          <div
            className="mt-2 flex gap-4"
            onClick={() => setIsReplying(!isReplying)}
          >
            <button className="text-sm text-blue-500 hover:text-blue-700">
              {isReplying ? "Cancle reply" : "Reply"}
            </button>
          </div>
        )}

        {isReplying && (
          <div className="mt-4">
            <CommentForm
              blogId={blogId}
              parentId={comment.$id}
              onSuccess={handleReplySuccess}
            />
          </div>
        )}
      </div>
    </section>
  );
}
