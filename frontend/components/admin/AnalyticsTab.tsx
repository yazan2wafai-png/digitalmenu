'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface DailyBreakdown {
  date: string;
  views: number;
}

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  last7DaysViews: number;
  last30DaysViews: number;
  dailyBreakdown: DailyBreakdown[];
}

export default function AnalyticsTab({ slug }: { slug: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/proxy/admin/analytics/${slug}`);
      if (!res.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading && !data) {
    return <div className="p-4 text-gray-500">Loading analytics...</div>;
  }

  if (error && !data) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button onClick={fetchAnalytics} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-gray-900">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Analytics for {slug}</h2>
        <div className="flex items-center space-x-4 text-sm">
          {lastUpdated && <span className="text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>}
          <button 
            onClick={fetchAnalytics} 
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? 'Refreshing...' : 'Manual Refresh'}
          </button>
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Views" value={data.totalViews} />
            <StatCard title="Today's Views" value={data.todayViews} />
            <StatCard title="Last 7 Days" value={data.last7DaysViews} />
            <StatCard title="Last 30 Days" value={data.last30DaysViews} />
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-xs border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">30-Day Trend</h3>
            <TrendChart data={data.dailyBreakdown} />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 flex flex-col">
      <span className="text-gray-500 text-sm font-medium">{title}</span>
      <span className="text-3xl font-bold mt-2 text-gray-900">{value?.toLocaleString() || 0}</span>
    </div>
  );
}

function TrendChart({ data }: { data: DailyBreakdown[] }) {
  if (!data || data.length === 0) return <div className="text-gray-500 py-8 text-center">No data available.</div>;

  const maxViews = Math.max(...data.map(d => d.views), 1);
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY - paddingBottom;
  
  const barWidth = chartWidth / data.length;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-w-[600px] overflow-visible">
        {/* Y Axis labels */}
        <text x={paddingX - 10} y={paddingY + 5} className="text-[12px] fill-gray-500" textAnchor="end">{maxViews}</text>
        <text x={paddingX - 10} y={height - paddingBottom + 5} className="text-[12px] fill-gray-500" textAnchor="end">0</text>
        
        {/* Grid lines */}
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e5e7eb" strokeDasharray="4" />
        <line x1={paddingX} y1={height - paddingBottom} x2={width - paddingX} y2={height - paddingBottom} stroke="#e5e7eb" />

        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.views / maxViews) * chartHeight;
          const x = paddingX + i * barWidth + (barWidth * 0.1);
          const y = height - paddingBottom - barHeight;
          const w = Math.max(barWidth * 0.8, 1); // at least 1px wide
          
          return (
            <g key={i} className="group">
              <rect
                x={x}
                y={y}
                width={w}
                height={barHeight}
                fill="#3b82f6"
                className="hover:fill-blue-600 transition-colors cursor-pointer"
              />
              {/* Tooltip / Data Label on hover */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                <rect 
                  x={x + w / 2 - 20} 
                  y={Math.max(y - 25, 0)} 
                  width="40" 
                  height="20" 
                  rx="4" 
                  fill="#1f2937" 
                />
                <text
                  x={x + w / 2}
                  y={Math.max(y - 11, 14)}
                  textAnchor="middle"
                  className="text-[11px] fill-white font-medium"
                >
                  {d.views}
                </text>
              </g>
              
              {/* X Axis labels (sparse logic: ~7 labels max) */}
              {i % Math.ceil(data.length / 7) === 0 && (
                <text
                  x={x + w / 2}
                  y={height - paddingBottom + 20}
                  textAnchor="middle"
                  className="text-[11px] fill-gray-500"
                >
                  {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
