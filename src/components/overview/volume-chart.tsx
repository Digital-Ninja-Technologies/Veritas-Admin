"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatNairaCompact } from "@/lib/format";

const chartConfig = {
  kobo: {
    label: "Volume funded",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function VolumeChart({ data }: { data: { date: string; kobo: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <AreaChart data={data} margin={{ left: 12, right: 12 }}>
        <defs>
          <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tickFormatter={(value: string) =>
            new Date(value).toLocaleDateString("en-NG", { month: "short", day: "numeric" })
          }
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value as string).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }
              formatter={(value) => formatNairaCompact(Number(value))}
            />
          }
        />
        <Area dataKey="kobo" type="natural" fill="url(#fillVolume)" stroke="var(--color-primary)" />
      </AreaChart>
    </ChartContainer>
  );
}
