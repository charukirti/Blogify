import Header from "../ui/Header";
import FeaturedBlogs from "../ui/FeaturedBlogs";
import TagsSection from "../ui/TagsSection";

export default function Blogs() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <FeaturedBlogs />
          <TagsSection />
        </div>
      </div>
    </main>
  );
}
