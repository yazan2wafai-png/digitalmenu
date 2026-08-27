'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SuperAdminAnalyticsResponse as AnalyticsResponse, SuperAdminDailyView as DailyView } from '@/types/super-admin';

interface Props {
  slug: string;
  restaurantName?: string;
  onClose: () => void;
}

export function AnalyticsModal({ slug, restaurantName, onClose }: Props) {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchViews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/proxy/super-admin/restaurants/${slug}/views`);
      if (!res.ok) {
        throw new Error(`Failed to load views (${res.status})`);
      }
      const json: AnalyticsResponse = await res.json();
      // Ensure dailyViews are sorted chronologically
      if (json.dailyViews) {
        json.dailyViews.sort((a, b) => a.date.localeCompare(b.date));
      }
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching analytics');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchViews();
  }, [fetchViews]);

  // Derived metrics
  const thirtyDaySum = data?.dailyViews?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const thirtyDayAvg = data?.dailyViews?.length ? (thirtyDaySum / data.dailyViews.length).toFixed(1) : '0';
  const peakDay = data?.dailyViews?.reduce(
    (max, curr) => (curr.count > max.count ? curr : max),
    { date: '-', count: 0 }
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-indigo-950/50 my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-lg">
              📈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {restaurantName || slug} PageView Analytics
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {slug}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                30-day traffic breakdown &amp; lifetime engagement tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchViews}
              disabled={loading}
              title="Refresh"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer disabled:opacity-50"
            >
              <svg
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading && !data && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className="text-sm">Fetching analytics data...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                onClick={fetchViews}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {data && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Lifetime Views
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {data.totalViews.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                    Last 30 Days Total
                  </div>
                  <div className="text-2xl font-bold text-indigo-300 mt-1">
                    {thirtyDaySum.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Daily Average
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {thirtyDayAvg}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Peak Day Record
                  </div>
                  <div className="text-2xl font-bold text-violet-400 mt-1">
                    {peakDay ? `${peakDay.count}` : '0'}
                  </div>
                  {peakDay?.date && peakDay.date !== '-' && (
                    <div className="text-[10px] text-slate-500 font-mono">{peakDay.date}</div>
                  )}
                </div>
              </div>

              {/* 30-Day SVG Chart */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">30-Day Traffic Velocity</h3>
                  <span className="text-xs text-slate-400">Total: {thirtyDaySum} Views</span>
                </div>
                <ChartSVG dailyViews={data.dailyViews} />
              </div>

              {/* Day-by-Day Log */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Recent Daily Breakdown
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {data.dailyViews.length} days recorded
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 text-left bg-slate-900/30">
                        <th className="px-5 py-2 font-medium">Date</th>
                        <th className="px-5 py-2 font-medium text-right">PageViews</th>
                        <th className="px-5 py-2 font-medium">Visual Proportion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-300">
                      {[...data.dailyViews].reverse().slice(0, 14).map((item) => {
                        const maxCount = Math.max(...data.dailyViews.map((d) => d.count), 1);
                        const percent = Math.round((item.count / maxCount) * 100);
                        return (
                          <tr key={item.date} className="hover:bg-slate-900/50 transition">
                            <td className="px-5 py-2.5 font-mono text-slate-400">{item.date}</td>
                            <td className="px-5 py-2.5 text-right font-bold text-white">
                              {item.count.toLocaleString()}
                            </td>
                            <td className="px-5 py-2.5">
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-indigo-500 h-full rounded-full"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

function ChartSVG({ dailyViews }: { dailyViews: DailyView[] }) {
  if (!dailyViews || dailyViews.length === 0) {
    return <div className="text-center py-10 text-slate-500 text-xs">No view history recorded.</div>;
  }

  const maxViews = Math.max(...dailyViews.map((d) => d.count), 5);
  const width = 700;
  const height = 200;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barSlot = chartWidth / dailyViews.length;
  const barWidth = Math.max(barSlot * 0.7, 3);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
        {/* Y Axis Grid lines */}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={width - paddingRight}
          y2={paddingTop}
          stroke="#334155"
          strokeDasharray="4"
        />
        <line
          x1={paddingLeft}
          y1={paddingTop + chartHeight / 2}
          x2={width - paddingRight}
          y2={paddingTop + chartHeight / 2}
          stroke="#334155"
          strokeDasharray="4"
        />
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#475569"
        />

        {/* Y Axis Labels */}
        <text
          x={paddingLeft - 8}
          y={paddingTop + 4}
          textAnchor="end"
          className="text-[10px] fill-slate-400 font-mono"
        >
          {maxViews}
        </text>
        <text
          x={paddingLeft - 8}
          y={paddingTop + chartHeight / 2 + 4}
          textAnchor="end"
          className="text-[10px] fill-slate-400 font-mono"
        >
          {Math.round(maxViews / 2)}
        </text>
        <text
          x={paddingLeft - 8}
          y={height - paddingBottom + 4}
          textAnchor="end"
          className="text-[10px] fill-slate-400 font-mono"
        >
          0
        </text>

        {/* Bars */}
        {dailyViews.map((d, idx) => {
          const barHeight = (d.count / maxViews) * chartHeight;
          const x = paddingLeft + idx * barSlot + (barSlot - barWidth) / 2;
          const y = height - paddingBottom - barHeight;

          return (
            <g key={d.date} className="group">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx="2"
                className="fill-indigo-500 group-hover:fill-indigo-400 transition cursor-pointer"
              />

              {/* Tooltip on Hover */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <rect
                  x={x + barWidth / 2 - 28}
                  y={Math.max(y - 24, 0)}
                  width="56"
                  height="20"
                  rx="4"
                  className="fill-slate-800 stroke stroke-slate-700"
                />
                <text
                  x={x + barWidth / 2}
                  y={Math.max(y - 10, 14)}
                  textAnchor="middle"
                  className="text-[10px] fill-white font-mono font-bold"
                >
                  {d.count} views
                </text>
              </g>

              {/* Sparse X-Axis Date Labels (~6 labels) */}
              {idx % Math.ceil(dailyViews.length / 6) === 0 && (
                <text
                  x={x + barWidth / 2}
                  y={height - paddingBottom + 16}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  {new Date(d.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
