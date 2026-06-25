import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: "primary" | "info" | "warning" | "destructive";
  trend?: { value: string; positive: boolean; caption: string };
  caption?: string;
}

const toneStyles: Record<StatCardProps["tone"], { bar: string; iconWrap: string; icon: string }> = {
  primary: {
    bar: "bg-primary",
    iconWrap: "bg-primary-soft",
    icon: "text-primary",
  },
  info: {
    bar: "bg-[var(--color-chart-3)]",
    iconWrap: "bg-secondary",
    icon: "text-[var(--color-chart-3)]",
  },
  warning: {
    bar: "bg-warning",
    iconWrap: "bg-warning-soft",
    icon: "text-warning",
  },
  destructive: {
    bar: "bg-destructive",
    iconWrap: "bg-destructive-soft",
    icon: "text-destructive",
  },
};

export function StatCard({ label, value, icon: Icon, tone, trend, caption }: StatCardProps) {
  const styles = toneStyles[tone];

  return (
    <Card className="relative overflow-hidden py-0">
      <span className={cn("absolute inset-y-0 left-0 w-1", styles.bar)} />
      <div className="flex items-start justify-between gap-3 p-5 pl-6">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground font-mono">
            {value}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  trend.positive ? "text-primary" : "text-destructive"
                )}
              >
                {trend.positive ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
                {trend.value}
              </span>
              <span className="text-muted-foreground">{trend.caption}</span>
            </div>
          )}
          {caption && !trend && (
            <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
          )}
        </div>
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", styles.iconWrap)}>
          <Icon className={cn("size-5", styles.icon)} />
        </div>
      </div>
    </Card>
  );
}
