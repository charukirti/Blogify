import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Posts":
        return <div>Your posts go here...</div>;
      case "Analytics":
        return <div>Your analytics data goes here...</div>;
      default:
        return <div>Select a tab to view content.</div>;
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
