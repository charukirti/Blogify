import { useEffect } from "react";
import { fetchAllPosts } from "../store/fetchPostSlice";
import BlogCard from "../ui/home/BlogCard";
import TagsSection from "../ui/home/TagsSection";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../ui/Loader";
import { useState } from "react";

export default function Blogs() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  const filteredPosts = selectedTag
    ? posts?.filter((post) => post.tags?.includes(selectedTag))
    : posts;

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {posts && <TagsSection posts={posts} onTagClick={handleTagClick} />}
      <h1 className="text-3xl font-bold mb-8 text-gray-200">
        Blog Posts {selectedTag && `- Tagged with ${selectedTag}`}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts?.map((post) => (
          <BlogCard key={post.$id} post={post} />
        ))}
      </div>
    </main>
  );
}
