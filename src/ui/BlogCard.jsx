export default function BlogCard() {
    const dummyData = {
      thumbnail: "https://via.placeholder.com/600x300", // Replace with your image URL
      title: "The Future of JavaScript",
      description:
        "Discover how JavaScript is evolving with new features and frameworks. Learn how it can shape the future of web development.",
      publishedAt: "2024-12-20",
      updatedAt: "2024-12-22",
      likes: 25,
      comments: 8,
    };
  
    return (
      <div className="bg-[#1e1e2f] p-4 rounded-lg shadow-lg hover:shadow-xl transition">
        {/* Thumbnail */}
        <img
          src={dummyData.thumbnail}
          alt="Thumbnail"
          className="w-full h-64 object-cover rounded-lg"
        />
  
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h2 className="text-[#ffffff] text-2xl font-semibold">{dummyData.title}</h2>
  
          {/* Description */}
          <p className="text-[#c0c0c0] text-sm mt-2 line-clamp-3">
            {dummyData.description}
          </p>
  
          {/* Metadata */}
          <div className="flex justify-between items-center text-[#a0a0b0] text-xs mt-4">
            <div>
              <p>Published at: {dummyData.publishedAt}</p>
              <p>Updated at: {dummyData.updatedAt}</p>
            </div>
            <div className="flex items-center gap-4">
              <p>❤️ {dummyData.likes}</p>
              <p>💬 {dummyData.comments}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  