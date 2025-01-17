export default function AnalyticsCard({ title, value }) {
  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <h2 className="mb-2 text-center text-xl text-gray-400">{title}</h2>
      <p className="text-center text-4xl font-bold text-white">{value || 0}</p>
    </div>
  );
}
