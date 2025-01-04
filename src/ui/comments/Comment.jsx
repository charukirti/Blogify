import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment } from "../../store/interactionsSlice";
import interactionService from "../../services/interactionService";
import CommentForm from "./CommentForm";
import EditCommentForm from "./EditCommentForm";

export default function Comment({ comment, blogId, currentUserId }) {
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
        data.content
      );
      dispatch(
        updateComment({
          blogId,
          commentId: comment.$id,
          content: updatedComment.content,
        })
      );
      setIsEditing(false);
    } catch (error) {
      console.log("Error editing comment:", error.message);
    }
  }

  return (
    <section className="border-l-2 border-gray-200 pl-4 mb-4">
      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-400">{comment.user_id}</div>
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
          <p className="m-2 text-gray-700">{comment.content}</p>
        )}

        {!isEditing && (
          <div
            className="mt-2 flex gap-4"
            onClick={() => setIsReplying(!isReplying)}
          >
            <button className="text-blue-500 hover:text-blue-700 text-sm">
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
