import { useDispatch } from "react-redux";
import { deletePost } from "../../store/fetchPostSlice";

export default function DeletePostModal({ handleShowDeleteModal, post }) {
  const dispatch = useDispatch();

  async function handleDelete() {
    try {
      await dispatch(
        deletePost({
          postId: post.$id,
          fileId: post.featuredImage,
        }),
      ).unwrap();
      handleShowDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-extrabold">{post.title}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => handleShowDeleteModal(false)}
            className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
