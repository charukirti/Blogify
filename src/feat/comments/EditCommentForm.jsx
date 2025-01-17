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
        className="w-full rounded-lg px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        rows={3}
      />

      {errors.content && (
        <span className="text-sm text-red-500">{errors.content.message}</span>
      )}

      <button
        type="submit"
        className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
      >
        Save
      </button>
    </form>
  );
}
