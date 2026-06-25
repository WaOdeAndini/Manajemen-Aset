"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { KondisiRingkasanItem } from "@/lib/types";

export function ConditionChart({ data }: { data: KondisiRingkasanItem[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={56}
              outerRadius={78}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} unit`, name]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                fontSize: 12,
                background: "var(--color-popover)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-foreground font-mono">{total}</span>
          <span className="text-[11px] text-muted-foreground">unit aset</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        {data.map((item) => {
          const percent = total === 0 ? 0 : ((item.value / total) * 100).toFixed(0);
          return (
            <div key={item.name} className="flex items-center gap-2.5 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="min-w-0 flex-1 truncate text-foreground">{item.name}</span>
              <span className="text-muted-foreground font-mono text-xs">{item.value}</span>
              <span className="w-10 text-right text-xs text-muted-foreground">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
