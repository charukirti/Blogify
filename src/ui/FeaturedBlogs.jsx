


const featuredBlogs = [
  { 
    id: 1, 
    title: "Getting Started with React", 
    excerpt: "Learn the basics of React and start building your first app.",
    thumbnail: "/placeholder.svg?height=200&width=300"
  },
  { 
    id: 2, 
    title: "Advanced TypeScript Techniques", 
    excerpt: "Dive deep into TypeScript and learn advanced concepts.",
    thumbnail: "/placeholder.svg?height=200&width=300"
  },
  { 
    id: 3, 
    title: "The Future of Web Development", 
    excerpt: "Explore upcoming trends and technologies in web development.",
    thumbnail: "/placeholder.svg?height=200&width=300"
  },
]

export default function FeaturedBlogs() {
  return (
    <section className="flex-1">
      <h2 className="text-2xl font-bold mb-4">Featured Blogs</h2>
      <div className="space-y-4">
        {featuredBlogs.map((blog) => (
          <section key={blog.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3">
                <img 
                  src={blog.thumbnail} 
                  alt={blog.title}
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="w-full md:w-2/3">
                <div>
                  <p>{blog.title}</p>
                </div>
                <div>
                  <p>{blog.excerpt}</p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

