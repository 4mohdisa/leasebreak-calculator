import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Tooltip,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartData {
  [key: string]: string | number
}

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartData[]
  config: ChartConfig
  children?: React.ReactNode
}

export function ChartContainer({
  data,
  config,
  children,
  className,
  ...props
}: ChartProps) {
  // Create CSS variables for chart colors
  React.useEffect(() => {
    if (!config) return

    const style = document.createElement("style")
    const cssVars = Object.entries(config)
      .map(([key, value]) => `--color-${key}: ${value.color};`)
      .join("\n")
    style.textContent = `:root { ${cssVars} }`
    document.head.appendChild(style)

    // Cleanup function
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [config])

  if (!data?.length) {
    return (
      <div
        className={cn(
          "h-[350px] w-full flex items-center justify-center text-muted-foreground",
          className
        )}
        {...props}
      >
        No data available
      </div>
    )
  }

  return (
    <div className={cn("h-[350px] w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          {children}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipProps {
  cursor?: boolean
  formatter?: (value: number) => string
}

export function ChartTooltip({
  cursor = false,
  formatter,
  ...props
}: ChartTooltipProps) {
  return (
    <Tooltip
      cursor={cursor}
      content={<ChartTooltipContent formatter={formatter} />}
      {...props}
    />
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{ color: string; name: string; value: number }>
  label?: string
  formatter?: (value: number) => string
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter = (value) => value.toString(),
}: ChartTooltipContentProps) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          <div className="font-medium">{label}</div>
          <div className="grid gap-1">
            {payload.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <div className="font-medium">
                  {formatter(item.value as number)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return null
}

interface ChartLineProps {
  dataKey: string
  stroke?: string
  strokeWidth?: number
  dot?: boolean
  className?: string
}

export function ChartLine({
  dataKey,
  stroke,
  strokeWidth = 2,
  dot = false,
}: ChartLineProps) {
  return (
    <Line
      type="monotone"
      dataKey={dataKey}
      stroke={stroke}
      strokeWidth={strokeWidth}
      dot={dot}
    />
  )
}

export function ChartGrid({
  className,
  ...props
}: React.ComponentProps<typeof CartesianGrid>) {
  return (
    <CartesianGrid
      className={cn("", className)}
      strokeDasharray="3 3"
      vertical={false}
      {...props}
    />
  )
}

export function ChartXAxis({
  className,
  ...props
}: React.ComponentProps<typeof XAxis>) {
  return (
    <XAxis
      className={cn("", className)}
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      padding={{ left: 20, right: 20 }}
      {...props}
    />
  )
}

export function ChartYAxis({
  className,
  ...props
}: React.ComponentProps<typeof YAxis>) {
  return (
    <YAxis
      className={cn("", className)}
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      padding={{ top: 20, bottom: 20 }}
      {...props}
    />
  )
}
