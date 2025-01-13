import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthorPostsIds } from "../../store/fetchPostSlice";
import analyticsService from "../../services/AnalyticsService";
import AnalyticsCard from "./AnalyticsCard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { LineChart } from "lucide-react";
import AnalyticsGraph from "./AnalyticsGraph";

export default function Analytics() {
  const dispatch = useDispatch();
  const authorPostsIds = useSelector((state) => state.posts.authorPostsIds);
  const userData = useSelector((state) => state.auth.userData);
  const [data, setData] = useState({ likes: 0, comments: 0, views: 0 });
  const [period, setPeriod] = useState("weekly");
  const [isLoading, setIsLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);

  const fetchAnalyticsData = useCallback(async () => {
    if (!authorPostsIds.length) return;
    setIsLoading(true);
    try {
      const result = await analyticsService.fetchAnalytics(
        authorPostsIds,
        period
      );
      setData(result.totals);
      setGraphData(result.timeSeries);
    } catch (error) {
      console.error("Analytics fetch error", error);
    } finally {
      setIsLoading(false);
    }
  }, [authorPostsIds, period]);

  useEffect(() => {
    dispatch(fetchAuthorPostsIds());
  }, [dispatch]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "weekly":
        return "Week";
      case "monthly":
        return "Month";
      case "yearly":
        return "Year";
      default:
        return "Period";
    }
  };

  return (
    <div className="h-screen mt-4">
      <select
        onChange={handlePeriodChange}
        value={period}
        className="mb-3 w-24 p-2 text-base"
      >
        <option value="weekly">Week</option>
        <option value="monthly">Month</option>
        <option value="yearly">Yearly</option>
      </select>
      <h1 className="text-4xl text-gray-200 font-bold mb-3">
        Analytics for {userData.name}
      </h1>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnalyticsCard
              title={`Readers this ${getPeriodLabel()}`}
              value={data.views}
            />
            <AnalyticsCard
              title={`Likes this ${getPeriodLabel()}`}
              value={data.likes}
            />
            <AnalyticsCard
              title={`Comments this ${getPeriodLabel()}`}
              value={data.comments}
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10  mt-4">
        <div className=" md:col-span-2 h-[350px] w-full">
          <AnalyticsGraph
            data={graphData}
            dataKey={"views"}
            title={"Views"}
            color={"#8884d8"}
          />
        </div>
        <div className="h-[300px] w-full">
          <AnalyticsGraph
            data={graphData}
            dataKey={"likes"}
            title={"Likes"}
            color={"#48dbfb"}
          />
        </div>
        <div className="h-[300px] w-full">
          <AnalyticsGraph
            data={graphData}
            dataKey={"comments"}
            title={"Comments"}
            color={"#e056fd"}
          />
        </div>
      </div>
    </div>
  );
}
