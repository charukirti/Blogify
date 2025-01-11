export default function AnalyticsCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-center text-xl text-gray-400 mb-2">{title}</h2>
      <p className="text-4xl text-center font-bold text-white">{value || 0}</p>
    </div>
  );
}
