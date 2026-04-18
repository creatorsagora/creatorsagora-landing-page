"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
    theme?: {
      light: string;
      dark: string;
    };
  }
>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("Chart components must be used inside <ChartContainer />");
  return context;
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const themedKeys = Object.entries(config).filter(([, item]) => item.color || item.theme);
  if (!themedKeys.length) return null;

  const darkVars = themedKeys
    .map(([key, item]) => `--color-${key}: ${item.theme?.dark ?? item.color};`)
    .join("\n");

  const lightVars = themedKeys
    .map(([key, item]) => `--color-${key}: ${item.theme?.light ?? item.color};`)
    .join("\n");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart="${id}"] {
  ${darkVars}
}
html[data-theme="light"] [data-chart="${id}"] {
  ${lightVars}
}
        `
      }}
    />
  );
}

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
};

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, config, children, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          className={cn(
            "h-[260px] w-full min-w-0 text-xs",
            "[&_.recharts-cartesian-axis-tick_text]:fill-[color:var(--muted-text)]",
            "[&_.recharts-cartesian-grid_line]:stroke-white/10",
            "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-white/10",
            "[&_.recharts-legend-item-text]:!text-[color:var(--muted-text)]",
            "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-white/20",
            className
          )}
          data-chart={chartId}
          ref={ref}
          {...props}
        >
          <ChartStyle config={config} id={chartId} />
          {mounted ? (
            <RechartsPrimitive.ResponsiveContainer height="100%" minWidth={0} width="100%">
              {children}
            </RechartsPrimitive.ResponsiveContainer>
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

export const ChartTooltip = RechartsPrimitive.Tooltip;
export const ChartLegend = RechartsPrimitive.Legend;

type ChartTooltipContentProps = React.ComponentProps<"div"> & {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    name?: string;
    value?: number | string;
    color?: string;
  }>;
  label?: string;
  hideLabel?: boolean;
  labelFormatter?: (label: string) => React.ReactNode;
  valueFormatter?: (value: number | string, dataKey: string) => React.ReactNode;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
  className,
  labelFormatter,
  valueFormatter
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className={cn("rounded-xl border border-pro-surface bg-pro-panel px-3 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.35)]", className)}>
      {!hideLabel && label ? (
        <p className="mb-2 text-xs font-semibold text-pro-main">{labelFormatter ? labelFormatter(label) : label}</p>
      ) : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = item.dataKey ?? item.name ?? `item-${index}`;
          const itemConfig = config[key];
          const tone = item.color ?? `var(--color-${key})`;
          const formattedValue = valueFormatter
            ? valueFormatter(item.value ?? 0, key)
            : typeof item.value === "number"
              ? item.value.toLocaleString()
              : (item.value ?? "-");

          return (
            <div className="flex items-center justify-between gap-2 text-xs" key={key}>
              <span className="inline-flex items-center gap-1.5 text-pro-muted">
                <span className="size-2 rounded-full" style={{ backgroundColor: tone }} />
                {itemConfig?.label ?? item.name ?? key}
              </span>
              <span className="mono-stat text-pro-main">{formattedValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ChartLegendContentProps = {
  payload?: Array<{
    value?: string;
    dataKey?: string;
    color?: string;
  }>;
  className?: string;
};

export function ChartLegendContent({ payload, className }: ChartLegendContentProps) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div className={cn("mt-2 flex flex-wrap items-center gap-3 text-xs text-pro-muted", className)}>
      {payload.map((item) => {
        const key = item.dataKey ?? item.value ?? "";
        const itemConfig = config[key];
        const tone = item.color ?? `var(--color-${key})`;
        return (
          <span className="inline-flex items-center gap-1.5" key={key}>
            <span className="size-2 rounded-full" style={{ backgroundColor: tone }} />
            {itemConfig?.label ?? item.value ?? key}
          </span>
        );
      })}
    </div>
  );
}
