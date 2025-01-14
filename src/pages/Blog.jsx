import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";
import { fetchPost } from "../store/fetchPostSlice";
import bucketService from "../services/bucketService";
import interactionService from "../services/interactionService";
import Loader from "../components/Loader";
import { htmlParserOptions } from "../utils/htmlCustomParser";
import CommentsSection from "../feat/comments/CommentsSection";
import LikeButton from "../components/LikeButton";
import { Eye } from "lucide-react";
import {
  checkHasLiked,
  fetchLikesCount,
  fetchViews,
  setHasLiked,
  updateLikesCount,
} from "../store/interactionsSlice";

export default function Blog() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { post, loading } = useSelector((state) => state.posts);
  const { userData } = useSelector((state) => state.auth);
  const { hasLiked, likesCount } = useSelector((state) => state.interactions);

  const viewsCount = useSelector(
    (state) => state.interactions.viewsCount[post.$id] || 0
  );

  const parsedContent = post?.content
    ? parse(post.content, htmlParserOptions)
    : "";

  async function handleToggleViews(blogId) {
    try {
      await interactionService.incrementViewsCount(blogId);
    } catch (error) {
      console.log("There was an error while incrementing views", error);
    }
  }

  async function handleToggleLike() {
    try {
      if (hasLiked[id]) {
        await interactionService.removeLike(id);
        dispatch(updateLikesCount({ blogId: id, likesChange: -1 }));
        dispatch(setHasLiked({ blogId: id, hasLiked: false }));
      } else {
        await interactionService.addLike(id);
        dispatch(updateLikesCount({ blogId: id, likesChange: 1 }));
        dispatch(setHasLiked({ blogId: id, hasLiked: true }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  useEffect(() => {
    if (!id) return;
    async function fetchPostData() {
      try {
        await Promise.all([
          dispatch(fetchPost(id)),
          dispatch(fetchLikesCount(id)),
          handleToggleViews(id),
          dispatch(fetchViews(id)),
        ]);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchPostData();
  }, [id, dispatch]);

  useEffect(() => {
    if (!id || !userData.$id) return;

    dispatch(
      checkHasLiked({
        blogId: id,
        userId: userData.$id,
      })
    );
  }, [dispatch, id, userData.$id]);

  if (loading) return <Loader />;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-100">
          {post?.title}
        </h1>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-200">
              {" "}
              <span className="text-sm">By</span> {post?.author_name}
            </p>
            <time className="text-gray-400 text-sm">
              Published on {new Date(post?.$createdAt).toLocaleDateString()}
            </time>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-200">
              <Eye />
              <span>{viewsCount}</span>
            </div>

            <LikeButton
              handleToggleLike={handleToggleLike}
              hasLiked={hasLiked}
              likesCount={likesCount}
              id={post?.$id}
            />
          </div>
        </div>
      </header>

      {post?.featuredImage && (
        <img
          src={bucketService.getFilePreview(post.featuredImage)}
          alt={post.title}
          className="w-full md:h-[480px] object-fill rounded-md mb-8"
        />
      )}

      <div className="prose lg:prose-xl prose-invert max-w-none">
        {parsedContent}
      </div>

      {post?.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="text-gray-400 text-sm  lg:text-base">Tags:</span>
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

      {post && <CommentsSection blogId={id} authorId={post.author_id} />}
    </article>
  );
}
