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
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="w-full space-y-4">
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-base font-medium text-gray-200 lg:text-3xl"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter your blog title"
                className="w-full border-b-2 bg-transparent py-2 text-xl text-gray-200 outline-none focus:border-b-blue-500 md:text-2xl"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="text-base font-medium text-gray-200 lg:text-3xl"
              >
                Slug
              </label>
              <input
                id="slug"
                type="text"
                placeholder="url-friendly-title"
                className="w-full border-b-2 bg-transparent py-2 text-xl text-gray-200 outline-none focus:border-b-blue-500 md:text-2xl"
                {...register("slug", { required: "Slug is required" })}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-base font-medium text-gray-200 lg:text-3xl"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Brief description of your blog post"
                rows={2}
                className="w-full border-b-2 bg-transparent py-2 text-xl text-gray-200 outline-none focus:border-b-blue-500 md:text-2xl"
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

            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-base font-medium text-gray-200 lg:text-3xl"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full rounded-md border px-3 py-2"
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

            <div className="space-y-2">
              <label
                htmlFor="tags"
                className="text-base font-medium text-gray-200 lg:text-3xl"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                placeholder="tag1, tag2, tag3"
                className="w-full border-b bg-transparent px-3 py-2 text-gray-200 focus:border-b-blue-400 focus:outline-none"
                {...register("tags")}
              />
              <p className="text-sm text-gray-500">Separate tags with commas</p>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="featuredImg"
                className="text-base font-medium text-gray-200 lg:text-3xl"
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
                    src={bucketService.getFilePreview(post.featuredImage)}
                    alt="Current featured image"
                    className="mt-1 h-32 w-auto rounded object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-200 lg:text-3xl">
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

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md px-6 py-2 text-white ${
              loading
                ? "cursor-not-allowed bg-blue-400"
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
