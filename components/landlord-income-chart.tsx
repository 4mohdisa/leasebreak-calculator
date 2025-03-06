"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface LandlordChartData {
  month: string
  rent: number
  expenses: number
  finalIncome: number
}

const chartConfig = {
  rent: {
    label: "Rental Income",
    color: "hsl(142, 76%, 36%)", // Green
  },
  expenses: {
    label: "Total Expenses",
    color: "hsl(0, 84%, 60%)", // Red
  },
  finalIncome: {
    label: "Final Income",
    color: "hsl(217, 91%, 60%)", // Blue
  },
} satisfies ChartConfig

interface LandlordIncomeChartProps {
  data: LandlordChartData[]
  totalIncome: number
  previousTotalIncome?: number
}

export function LandlordIncomeChart({ data, totalIncome, previousTotalIncome }: LandlordIncomeChartProps) {
  // Calculate percentage change
  const percentageChange = previousTotalIncome 
    ? ((totalIncome - previousTotalIncome) / previousTotalIncome) * 100 
    : 0

  const isPositiveChange = percentageChange >= 0

  return (
    <Card className="max-h-[500px] w-full overflow-hidden">
    <CardHeader>
      <CardTitle>Income Analysis</CardTitle>
      <CardDescription>Monthly Income Breakdown</CardDescription>
    </CardHeader>
    <CardContent className="p-4">
      {/* ChartContainer now uses full width and fixed height */}
      <ChartContainer config={chartConfig} className="w-full h-[250px]">
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            top: 10,
            right: 12,
            left: 12,
            bottom: 10,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.split(" ")[0].slice(0, 3)}
          />
          <ChartTooltip 
            cursor={false} 
            content={<ChartTooltipContent />}
            formatter={(value: number) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(value)
            }
          />
          <Line
            dataKey="rent"
            type="monotone"
            stroke="var(--color-rent)"
            strokeWidth={1}
            dot={false}
          />
          <Line
            dataKey="expenses"
            type="monotone"
            stroke="var(--color-expenses)"
            strokeWidth={1}
            dot={false}
          />
          <Line
            dataKey="finalIncome"
            type="monotone"
            stroke="var(--color-finalIncome)"
            strokeWidth={1}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </CardContent>
    <CardFooter>
      <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2">
          {previousTotalIncome && (
            <div className="flex items-center gap-2 font-medium leading-none">
              {isPositiveChange ? (
                <>
                  Income trending up by {Math.abs(percentageChange).toFixed(1)}% 
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              ) : (
                <>
                  Income trending down by {Math.abs(percentageChange).toFixed(1)}% 
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            Total Income: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(totalIncome)}
          </div>
        </div>
      </div>
    </CardFooter>
  </Card>
  

  )
}
