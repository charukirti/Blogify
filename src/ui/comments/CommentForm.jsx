import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../store/interactionsSlice";
import interactionService from "../../services/interactionService";

export default function CommentForm({
  blogId,
  parentId = null,
  onSuccess = () => {},
}) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.userData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      content: "",
    },
  });

  async function handleOnSubmit(data) {
    try {
      const response = await interactionService.addComment(
        blogId,
        data.content,
        parentId,
        currentUser?.name
      );
      dispatch(addComment({ blogId, comment: response }));
      reset();
      onSuccess();
    } catch (error) {
      console.log("Error adding comment:", error.message);
      throw new Error(error.message);
    }
  }

  return (
    <form className="mb-4" onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="flex flex-col gap-2">
        <textarea
          {...register("content", {
            required: "Comment text is required",
            minLength: {
              value: 3,
              message: "Comment must be at least 3 characters long",
            },
          })}
          className="w-full px-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write a comment..."
          rows={3}
        />
        {errors.content && (
          <span className="text-red-500 text-sm">{errors.content.message}</span>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding..." : "Add your comment"}
        </button>
      </div>
    </form>
  );
}
