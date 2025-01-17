import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthorPostsIds } from "../../store/fetchPostSlice";
import analyticsService from "../../services/AnalyticsService";
import AnalyticsCard from "./AnalyticsCard";
import AnalyticsGraph from "./AnalyticsGraph";
import { getUser } from "../../store/authSlice";

export default function Analytics() {
  const dispatch = useDispatch();
  const authorPostsIds = useSelector((state) => state.posts.authorPostsIds);
  const userData = useSelector((state) => state.auth.userData);
  const [data, setData] = useState({ likes: 0, comments: 0, views: 0 });
  const [period, setPeriod] = useState("weekly");
  const [isLoading, setIsLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const fetchAnalyticsData = useCallback(async () => {
    if (!authorPostsIds.length) return;
    setIsLoading(true);
    try {
      const result = await analyticsService.fetchAnalytics(
        authorPostsIds,
        period,
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
    if (userData) {
      // Only fetch if we have user data
      dispatch(fetchAuthorPostsIds());
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData) {
      // Only fetch if we have user data
      fetchAnalyticsData();
    }
  }, [fetchAnalyticsData, userData]);

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
    <div className="mt-4 h-screen">
      <select
        onChange={handlePeriodChange}
        value={period}
        className="mb-3 w-24 p-2 text-base"
      >
        <option value="weekly">Week</option>
        <option value="monthly">Month</option>
        <option value="yearly">Yearly</option>
      </select>
      <h1 className="mb-3 text-4xl font-bold text-gray-200">
        Analytics for {userData?.name}
      </h1>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
      <div className="mt-4 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="h-[350px] w-full md:col-span-2">
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
