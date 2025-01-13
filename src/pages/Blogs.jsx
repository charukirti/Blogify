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
    [selectedTag]
  );

  const filteredPosts = useMemo(
    () =>
      selectedTag
        ? posts?.filter((post) => post.tags?.includes(selectedTag))
        : posts,
    [selectedTag, posts]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 mt-3">
          <h1 className="text-3xl font-bold mb-8 w-fit text-gray-200 bg-black/20 backdrop-blur-sm sticky top-24 z-30">
            Blog Posts {selectedTag && `- Tagged with ${selectedTag}`}
          </h1>
          <div className="lg:space-y-8">
            {filteredPosts?.map((post) => (
              <Suspense fallback={<Loader />} key={post.$id}>
                <BlogCard key={post.$id} post={post} />
              </Suspense>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start h-fit mt-3 ">
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
