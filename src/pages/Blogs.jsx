import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../store/fetchPostSlice";
const BlogCard = lazy(() => import("../components/home/BlogCard"));
const TagsSection = lazy(() => import("../components/home/TagsSection"));
import Loader from "../components/Loader";

export default function Blogs() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const handleTagClick = useCallback(
    (tag) => {
      setSelectedTag(tag === selectedTag ? null : tag);
    },
    [selectedTag],
  );

  const filteredPosts = useMemo(
    () =>
      selectedTag
        ? posts?.filter((post) => post.tags?.includes(selectedTag))
        : posts,
    [selectedTag, posts],
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="mt-3 lg:col-span-2">
          <h1 className="mb-8 text-2xl font-bold text-gray-200">
            Blog Posts {selectedTag && `- Tagged with ${selectedTag}`}
          </h1>
          <div className="space-y-5 lg:space-y-8">
            {filteredPosts?.map((post) => (
              <Suspense fallback={<Loader />} key={post.$id}>
                <BlogCard key={post.$id} post={post} />
              </Suspense>
            ))}
          </div>
        </div>

        <div className="mt-3 hidden h-fit md:block lg:sticky lg:top-24 lg:self-start">
          {posts && (
            <Suspense fallback={<Loader />}>
              <TagsSection posts={posts} onTagClick={handleTagClick} />
            </Suspense>
          )}
        </div>
      </div>
    </main>
  );
}
