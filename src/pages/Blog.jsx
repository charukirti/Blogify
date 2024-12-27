import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost } from "../store/fetchPostSlice";
import bucketService from "../services/bucketService";
import { useEffect } from "react";
import Loader from "../ui/Loader";

export default function Blog (){
  const { id } = useParams();
  const dispatch = useDispatch();
  const { post, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (id) dispatch(fetchPost(id));
  }, [id, dispatch]);

  if (loading) return <Loader />;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{post?.title}</h1>
        <div className="flex items-center gap-4 mb-6">
          {post?.author?.avatar && (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-200">{post?.author?.name}</p>
            <time className="text-gray-400 text-sm">
              {new Date(post?.$createdAt).toLocaleDateString()}
            </time>
          </div>
        </div>
      </header>

      {post?.featuredImage && (
        <img
          src={bucketService.getFilePreview(post.featuredImage)}
          alt={post.title}
          className="w-full h-[480px] object-cover rounded-lg mb-8"
        />
      )}

      <div className="prose lg:prose-xl prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post?.content }} />
      </div>

      {post?.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <footer className="mt-12 p-6 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-4">
          {post?.author?.avatar && (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h3 className="font-medium mb-1 text-gray-200">
              Written by {post?.author?.name}
            </h3>
            <p className="text-gray-400">
              {post?.author?.bio || "No bio available"}
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
};


