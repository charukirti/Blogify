

const tags = ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Next.js", "Node.js", "GraphQL"]

export default function TagsSection() {
  return (
    <aside className="w-full md:w-64">
      <h2 className="text-2xl font-bold mb-4">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button key={tag}  size="sm">
            {tag}
          </button>
        ))}
      </div>
    </aside>
  )
}

