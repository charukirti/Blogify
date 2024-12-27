import BlogCard from "../ui/home/BlogCard";
import TagsSection from "../ui/home/TagsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <BlogCard />
          <TagsSection />
        </div>
      </div>
    </main>
  );
}


// export default function Home() {
//   return (
//     <main className="min-h-screen bg-background text-foreground">
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row gap-8">
//          {posts.map((post) => (
//                   <BlogCard key={post.$id} post={post} />
//                 ))}
//         </div>
//       </div>
//     </main>
//   );
// }
