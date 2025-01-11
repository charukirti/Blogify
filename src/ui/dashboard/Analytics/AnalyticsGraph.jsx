import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export default function AnalyticsGraph({ title, data, dataKey, color }) {
  return (
    <>
      <h2 className="text-left text-lg font-bold mb-2 text-gray-200">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={730} height={250} data={data}>
          <CartesianGrid strokeDasharray="3, 3" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={color} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
