import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";

const data = [
  { date: "Apr 1, 2022", value: 50000 },
  { date: "Apr 5", value: 80000 },
  { date: "Apr 10", value: 120000 },
  { date: "Apr 15", value: 95000 },
  { date: "Apr 20", value: 110000 },
  { date: "Apr 25", value: 140000 },
  { date: "Apr 30, 2022", value: 85000 },
];

export function RevenueChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            axisLine={{ fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => {
              if (value.includes("Apr 1") || value.includes("Apr 30")) {
                return value;
              }
              return "";
            }}
          />
          <Line
            type="natural"
            dataKey="value"
            stroke="hsl(var(--chart-line))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
