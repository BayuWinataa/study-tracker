"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getWeeklyPointsData } from "@/actions/chart";
import { FaChartSimple } from "react-icons/fa6";

export function ActivityChart() {
  const [data, setData] = useState<{ day: string; points: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getWeeklyPointsData();
        setData(res.data);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center border-4 border-foreground bg-card text-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <div className="animate-pulse flex items-center gap-2">
          <FaChartSimple className="h-6 w-6" />
          <span className="font-black uppercase tracking-widest">Loading Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-4 border-foreground bg-card text-card-foreground p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
      <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-b-2 border-foreground pb-2 flex items-center gap-2">
        <FaChartSimple className="h-5 w-5" />
        Weekly Activity
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--card-foreground)", fontWeight: 900 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--card-foreground)", fontWeight: 900 }}
            />
            <Tooltip 
              cursor={{ fill: "var(--card-foreground)", opacity: 0.1 }}
              contentStyle={{ 
                backgroundColor: "var(--card-foreground)", 
                color: "var(--card)",
                border: "none",
                borderRadius: "0",
                fontWeight: "900",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)"
              }}
              itemStyle={{ color: "var(--card)", fontWeight: "900" }}
            />
            <Bar 
              dataKey="points" 
              fill="var(--primary)" 
              radius={[0, 0, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
