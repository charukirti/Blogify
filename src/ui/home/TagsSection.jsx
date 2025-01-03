export default function TagsSection({ posts, onTagClick }) {
  const uniqueTags = [...new Set(posts.flatMap((post) => post.tags))];
  return (
    <section className="mb-3 flex items-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-200 mr-2">Filter by Tags</h2>
      <div className="flex flex-wrap gap-2 items-center">
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            size="sm"
            className="text-gray-200 bg-zinc-400 px-2 py-1 rounded"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
