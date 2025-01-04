import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { fetchComments } from "../../store/interactionsSlice";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

const selectCommentsByBlogId = createSelector(
  [(state) => state.interactions.comments, (_, blogId) => blogId],
  (comments, blogId) => comments[blogId] || []
);

const selectLoading = (state) => state.interactions.loading;
const selectCurrentUser = (state) => state.auth.userData;

export default function CommentSection({ blogId, authorId }) {
  const dispatch = useDispatch();

  const comments = useSelector((state) =>
    selectCommentsByBlogId(state, blogId)
  );
  const loading = useSelector(selectLoading);
  const currentUser = useSelector(selectCurrentUser);

  const { topLevelComments, repliesByParentId } = useMemo(() => {
    return {
      topLevelComments: comments
        .filter((comment) => !comment.parent_id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      repliesByParentId: comments.reduce((acc, comment) => {
        if (comment.parent_id) {
          acc[comment.parent_id] = [
            ...(acc[comment.parent_id] || []),
            comment,
          ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        return acc;
      }, {}),
    };
  }, [comments]);

  useEffect(() => {
    dispatch(fetchComments(blogId));
  }, [dispatch, blogId]);

  if (loading && !comments.length) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-200">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-200">Comments</h2>
        <span className="text-gray-200">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </span>
      </div>

      <div className="mb-8">
        <CommentForm blogId={blogId} />
      </div>

      <div className="space-y-6">
        {topLevelComments.map((comment) => (
          <div key={comment.$id}>
            <Comment
              comment={comment}
              blogId={blogId}
              currentUserId={currentUser?.$id}
              userName={comment.username || "Anonymous"}
              authorId={authorId}
            />

            <div className="ml-8 mt-4 space-y-4">
              {repliesByParentId[comment.$id]?.map((reply) => (
                <Comment
                  key={reply.$id}
                  comment={reply}
                  blogId={blogId}
                  currentUserId={currentUser?.$id}
                  userName={reply.username || "Anonymous"}
                  authorId={authorId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {!loading && comments.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
}
