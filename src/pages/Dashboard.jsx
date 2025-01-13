import { lazy, Suspense, useState } from "react";
import Loader from "../components/Loader";
import Analytics from "../feat/Analytics/Analytics";
const AuthorPosts = lazy(() => import("../feat/dashboard/AuthorPosts"));

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Posts");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Posts":
        return (
          <Suspense fallback={<Loader />}>
            <AuthorPosts />
          </Suspense>
        );
      case "Analytics":
        return <Analytics />;
      default:
        return (
          <p className="text-base lg:text-2xl text-gray-200">
            Select the tab you want
          </p>
        );
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center border-b border-gray-200">
        {["Posts", "Analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
}
