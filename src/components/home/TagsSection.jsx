export default function TagsSection({ posts, onTagClick }) {
  const uniqueTags = [...new Set(posts.flatMap((post) => post.tags))];

  return (
    <section className="mb-3 flex items-center lg:flex-col">
      <h1 className="mb-4 mr-2 text-left text-xl text-gray-200 lg:text-3xl">
        Filter by Tags
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            size="sm"
            className="rounded bg-zinc-400 px-2 py-1 text-gray-200"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
