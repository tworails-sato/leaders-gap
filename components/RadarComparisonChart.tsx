"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

type RadarRow = {
  key: string;
  theme: string;
  executiveScore: number | null;
  fieldScore: number | null;
};

type Props = {
  data: RadarRow[];
  executiveLabel: string;
  fieldLabel: string;
};

export function RadarComparisonChart({ data, executiveLabel, fieldLabel }: Props) {
  const chartData = data.map((row) => ({
    ...row,
    [executiveLabel]: row.executiveScore ?? 0,
    [fieldLabel]: row.fieldScore ?? 0
  }));

  return (
    <div className="radar-frame">
      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={chartData} margin={{ top: 24, right: 52, bottom: 24, left: 52 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="theme" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[1, 5]} tickCount={5} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value) => Number(value).toFixed(2)}
            labelFormatter={(label) => `テーマ: ${label}`}
          />
          <Legend />
          <Radar
            name={executiveLabel}
            dataKey={executiveLabel}
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.2}
            strokeWidth={2}
            dot
          />
          <Radar
            name={fieldLabel}
            dataKey={fieldLabel}
            stroke="#dc2626"
            fill="#dc2626"
            fillOpacity={0.14}
            strokeWidth={2}
            strokeDasharray="6 4"
            dot
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
