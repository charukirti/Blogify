import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import bucketService from "../../services/bucketService";
import dbService from "../../services/DatabaseService";
import { useCallback, useEffect, useState } from "react";
import RTE from "./RTE";

export default function PostForm({ post }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      description: post?.description || "",
      status: post?.status || "active",
      tags: post?.tags?.join(", ") || "",
      content: post?.content || "",
      featuredImage: post?.featuredImage || "",
    },
  });

  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const generateSlug = useCallback((title) => {
    if (title && typeof title === "string")
      return title
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s-]/g, "")
        .replace(/\s+/g, "-");
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", generateSlug(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, generateSlug, setValue]);

  async function submit(data) {
    try {
      setError("");
      setLoading(true);

      const { tags, image, slug, title, content, description, status } = data;
      const parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      let fileId = post?.featuredImage || null;
      if (image && image[0]) {
        const file = await bucketService.uploadFile(image[0]);
        if (post?.featuredImage) {
          await bucketService.deleteFile(post.featuredImage);
        }
        fileId = file.$id;
      }

      const postData = {
        title,
        slug,
        content,
        description,
        status,
        tags: parsedTags,
        featuredImage: fileId,
      };

      if (!post) {
        postData.author_id = userData.$id;
        postData.author_name = userData.name;
      }

      const dbPost = post
        ? await dbService.updatePost(post.$id, postData)
        : await dbService.createPost(postData);

      if (dbPost) {
        reset();
        navigate(`/blog/${dbPost.$id}`);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      setError(error.message || "Error while saving the post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2 bg-slate-300 p-4 rounded-md">
              <label
                htmlFor="title"
                className="text-base lg:text-2xl font-semibold text-gray-900"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter your blog title"
                className="w-full px-3 py-2 border rounded-md"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2 bg-slate-300 p-4 rounded-md">
              <label
                htmlFor="slug"
                className="text-base lg:text-2xl font-semibold text-gray-900"
              >
                Slug
              </label>
              <input
                id="slug"
                type="text"
                placeholder="url-friendly-title"
                className="w-full px-3 py-2 border rounded-md"
                {...register("slug", { required: "Slug is required" })}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2 bg-slate-300 p-4 rounded-md">
              <label
                htmlFor="description"
                className="text-base font-semibold text-gray-900"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Brief description of your blog post"
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2 bg-slate-300 p-4 rounded-md">
              <label
                htmlFor="status"
                className="text-base font-semibold text-gray-900"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border rounded-md"
                {...register("status", { required: "Status is required" })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2 bg-slate-300 p-4 rounded-md">
              <label
                htmlFor="tags"
                className="text-base font-semibold text-gray-900"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                placeholder="tag1, tag2, tag3"
                className="w-full px-3 py-2 border rounded-md"
                {...register("tags")}
              />
              <p className="text-sm text-gray-500">Separate tags with commas</p>
            </div>

            <div className="space-y-2 bg-slate-300 p-4 rounded-md">
              <label
                htmlFor="featuredImg"
                className="text-base font-semibold text-gray-900"
              >
                Featured Image
              </label>
              <input
                id="featuredImg"
                type="file"
                accept="image/*"
                className="w-full"
                {...register("image")}
              />
              {post?.featuredImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Current image:</p>
                  <img
                    src={post.featuredImage}
                    alt="Current featured image"
                    className="mt-1 h-32 w-auto object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 bg-slate-300 p-2 ">
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-900">
                Content
              </label>
              <RTE
                control={control}
                name="content"
                defaultValue={post?.content}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-md ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
