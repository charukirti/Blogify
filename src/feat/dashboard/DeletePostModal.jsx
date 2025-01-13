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
        })
      ).unwrap();
      handleShowDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-extrabold">{post.title}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => handleShowDeleteModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
