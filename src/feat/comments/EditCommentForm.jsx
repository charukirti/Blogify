import { useForm } from "react-hook-form";

export default function EditCommentForm({ comment, handleEdit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: comment.content,
    },
  });

  return (
    <form className="mt-2" onSubmit={handleSubmit(handleEdit)}>
      <textarea
        {...register("content", {
          required: "Comment text is required",
          minLength: {
            value: 3,
            message: "Comment must be at least 3 characters long",
          },
        })}
        className="w-full px-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={3}
      />

      {errors.content && (
        <span className="text-red-500 text-sm">{errors.content.message}</span>
      )}

      <button
        type="submit"
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save
      </button>
    </form>
  );
}
