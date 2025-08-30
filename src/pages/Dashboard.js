import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getClaims } from "../services/api";
import { generateInsights } from "../services/ai"; // ✅ will call our backend

export default function Dashboard() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    getClaims()
      .then((data) => setClaims(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  // Compute summary stats
  const totalClaims = claims.length;
  const approvedClaims = claims.filter(
    (c) => c.status.toLowerCase() === "approved"
  ).length;
  const pendingClaims = claims.filter(
    (c) => c.status.toLowerCase() === "pending"
  ).length;
  const rejectedClaims = claims.filter(
    (c) => c.status.toLowerCase() === "rejected"
  ).length;

  // Build chart data
  const countsByMonth = {};
  claims.forEach((c) => {
    const month = new Date(c.createdAt).toLocaleString("default", {
      month: "short",
    });
    countsByMonth[month] = (countsByMonth[month] || 0) + 1;
  });
  const chartData = Object.entries(countsByMonth).map(([month, count]) => ({
    month,
    claims: count,
  }));

  // ✅ Handle AI Insights
  const handleGenerateInsights = async () => {
    setLoadingInsight(true);
    setInsight("");
    try {
      const summary = `You have ${totalClaims} claims. ${approvedClaims} approved, ${pendingClaims} pending, ${rejectedClaims} rejected.`;
      const res = await generateInsights(summary);
      setInsight(res);
    } catch (err) {
      console.error(err);
      setInsight("⚠️ Unable to generate insights.");
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-2xl p-5 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total Claims</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalClaims}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-5 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approved Claims</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{approvedClaims}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-5 border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Claims</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{pendingClaims}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-5 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Rejected Claims</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">{rejectedClaims}</p>
        </div>
      </div>

      {/* Chart */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Claims Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="claims"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights section */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">AI Insights</h3>
            <button
              onClick={handleGenerateInsights}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              disabled={loadingInsight}
            >
              {loadingInsight ? "Generating..." : "Generate Insights"}
            </button>
          </div>
          <p className="text-gray-700 whitespace-pre-line">
            {insight || "Click the button to generate insights."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
