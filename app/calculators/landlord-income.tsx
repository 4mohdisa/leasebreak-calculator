"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Calculator } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { setRows, addRow, removeRow, setInterestPercentage, updateCalculations } from "@/lib/redux/landlordIncomeSlice"
import { FormLabel } from "@/components/ui/form"
// import { format } from 'date-fns';
import { ChartContainer, ChartGrid, ChartTooltip, ChartXAxis, ChartYAxis, ChartLine } from "@/components/ui/chart"

// Define the type for a single row of data
type IncomeRow = {
  id: string
  month: string
  rent: number
  realtorFees: number
  homeInsurance: number
  propertyMaintenance: number
  councilLevy: number
  waterSewer: number
  electricity: number
  gas: number
  tenantPaidBills: number
  finalIncome: number
}

// Define column keys type
type ColumnKey = keyof Omit<IncomeRow, 'id'>

// Define column order to match table header
const COLUMN_ORDER: ColumnKey[] = [
  'month',
  'rent',
  'realtorFees',
  'homeInsurance',
  'propertyMaintenance',
  'councilLevy',
  'waterSewer',
  'electricity',
  'gas',
  'tenantPaidBills',
  'finalIncome'
]

// Generate months for the current and next year
function generateMonthOptions(): string[] {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1

  return [
    ...months.map((month) => `${month} ${currentYear}`), 
    ...months.map((month) => `${month} ${nextYear}`)
  ]
}

// Function to download CSV
function downloadLandlordIncomeCSV(
  rows: IncomeRow[], 
  homeLoanInterest: number, 
  totalRemainingIncome: number, 
  interestPercentage: number
): void {
  // Create headers
  const headers = [
    "Month", "Rent", "Realtor Fees", "Home Insurance", 
    "Property Maintenance", "Council & Emergency Levy", 
    "Water & Sewer", "Electricity", "Gas", 
    "Tenant Paid Bills", "Final Income"
  ]

  // Format data
  const data = rows.map((row) => [
    row.month,
    row.rent,
    row.realtorFees,
    row.homeInsurance,
    row.propertyMaintenance,
    row.councilLevy,
    row.waterSewer,
    row.electricity,
    row.gas,
    row.tenantPaidBills,
    row.finalIncome
  ])

  // Add summary rows
  data.push([])
  data.push([`Home Loan Interest (${interestPercentage}%)`, "", "", "", "", "", "", "", "", "", homeLoanInterest])
  data.push(["Total Remaining Income", "", "", "", "", "", "", "", "", "", totalRemainingIncome])

  // Convert to CSV
  const csvContent = [
    headers.join(","), 
    ...data.map((row) => row.join(","))
  ].join("\n")

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  const date = new Date().toISOString().split("T")[0]

  link.setAttribute("href", url)
  link.setAttribute("download", `landlord-income-breakdown-${date}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Calculate final income for a single row
function calculateRowFinalIncome(row: Partial<IncomeRow>): number {
  const income = (row.rent || 0) + (row.tenantPaidBills || 0)
  const expenses = 
    (row.realtorFees || 0) +
    (row.homeInsurance || 0) +
    (row.propertyMaintenance || 0) +
    (row.councilLevy || 0) +
    (row.waterSewer || 0) +
    (row.electricity || 0) +
    (row.gas || 0)

  return Number.parseFloat((income - expenses).toFixed(2))
}



export function LandlordIncomeCalculator() {
  const dispatch = useDispatch()
  const monthOptions = generateMonthOptions()
  
  const {
    rows,
    homeLoanInterest,
    interestPercentage,
    totalRemainingIncome,
    totalIncomeBeforeLoan,
    incomeAfterLoan,
    incomeIncludingLoan,
    finalTotal
  } = useSelector((state: RootState) => state.landlordIncome)

  // Initialize with one empty row if no rows exist
  const defaultValues = {
    rows: rows?.length > 0 ? rows : [
      {
        id: "1",
        month: monthOptions[0],
        rent: 0,
        realtorFees: 0,
        homeInsurance: 0,
        propertyMaintenance: 0,
        councilLevy: 0,
        waterSewer: 0,
        electricity: 0,
        gas: 0,
        tenantPaidBills: 0,
        finalIncome: 0,
      },
    ],
  }

  const form = useForm({
    defaultValues,
  })

  const { control, watch, setValue } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  })

  const watchedRows = watch("rows")

  // Update Redux state when rows change
  useEffect(() => {
    if (watchedRows) {
      const updatedRows = watchedRows.map(row => ({
        ...row,
        finalIncome: calculateRowFinalIncome(row)
      }))
      dispatch(setRows(updatedRows))
      dispatch(updateCalculations())
    }
  }, [watchedRows, dispatch])

  // Initialize Redux state if empty
  useEffect(() => {
    if (!rows?.length) {
      dispatch(setRows(defaultValues.rows))
      dispatch(updateCalculations())
    }
  }, [dispatch, rows?.length, defaultValues.rows])

  // Calculate totals for each column
  const calculateColumnTotals = () => {
    const totals: Record<ColumnKey, number> = {
      month: 0, // This will be ignored in display
      rent: 0,
      realtorFees: 0,
      homeInsurance: 0,
      propertyMaintenance: 0,
      councilLevy: 0,
      waterSewer: 0,
      electricity: 0,
      gas: 0,
      tenantPaidBills: 0,
      finalIncome: 0
    }

    watchedRows.forEach(row => {
      (Object.keys(totals) as ColumnKey[]).forEach(key => {
        if (key !== 'month') {
          totals[key] += Number(row[key] || 0)
        }
      })
    })

    return totals
  }

  // Handle calculate button click
  const handleCalculate = () => {
    // Update final income for each row
    const updatedRows = watchedRows.map(row => ({
      ...row,
      finalIncome: calculateRowFinalIncome(row)
    }))
    
    // Update form values
    updatedRows.forEach((row, index) => {
      setValue(`rows.${index}.finalIncome`, row.finalIncome)
    })
    
    // Update Redux state
    dispatch(setRows(updatedRows))
    dispatch(updateCalculations())
  }

  // Add a new row
  const handleAddRow = () => {
    const newRow: IncomeRow = {
      id: Date.now().toString(),
      month: monthOptions[fields.length % monthOptions.length],
      rent: 0,
      realtorFees: 0,
      homeInsurance: 0,
      propertyMaintenance: 0,
      councilLevy: 0,
      waterSewer: 0,
      electricity: 0,
      gas: 0,
      tenantPaidBills: 0,
      finalIncome: 0,
    }
    append(newRow)
    dispatch(addRow(newRow))
    dispatch(updateCalculations())
  }

  // Download as CSV
  const handleDownloadCSV = () => {
    downloadLandlordIncomeCSV(rows, homeLoanInterest, totalRemainingIncome, interestPercentage)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Landlord&apos;s Income Breakdown</CardTitle>
        <CardDescription>Calculate and track your property income, expenses, and net returns</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Realtor Fees</TableHead>
                  <TableHead>Home Insurance</TableHead>
                  <TableHead>Property Maintenance</TableHead>
                  <TableHead>Council & Emergency Levy</TableHead>
                  <TableHead>Water & Sewer</TableHead>
                  <TableHead>Electricity</TableHead>
                  <TableHead>Gas</TableHead>
                  <TableHead>Tenant Paid Bills</TableHead>
                  <TableHead>Final Income</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.month`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                              {monthOptions.map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.rent`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            className="w-[100px]"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.realtorFees`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            className="w-[100px]"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.homeInsurance`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            className="w-[100px]"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.propertyMaintenance`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            className="w-[100px]"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.councilLevy`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            className="w-[100px]"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.waterSewer`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            className="w-[100px]"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.electricity`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            className="w-[100px]"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.gas`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            className="w-[100px]"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.tenantPaidBills`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            className="w-[100px]"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`rows.${index}.finalIncome`}
                        render={({ field }) => (
                          <div className="w-[100px] px-3 py-2 border rounded-md bg-muted">
                            {formatCurrency(field.value)}
                          </div>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      {fields.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            remove(index)
                            dispatch(removeRow(index))
                          }} 
                          className="h-8 w-8 p-0"
                        >
                          ✕
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Summary Row */}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>Total</TableCell>
                  {COLUMN_ORDER.slice(1).map(key => (
                    <TableCell key={key}>
                      {formatCurrency(calculateColumnTotals()[key])}
                    </TableCell>
                  ))}
                  <TableCell /> {/* Empty cell for the remove button column */}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 mb-4">
            <div className="flex items-center gap-4">
              <FormLabel htmlFor="interestPercentage" className="min-w-32">
                Home Loan Interest Rate:
              </FormLabel>
              <div className="flex items-center">
                <Input
                  id="interestPercentage"
                  type="number"
                  value={interestPercentage}
                  onChange={(e) => dispatch(setInterestPercentage(Number.parseFloat(e.target.value) || 0))}
                  className="w-20"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={handleAddRow}>
              Add Month
            </Button>
            <div className="space-x-2">
              <Button type="button" onClick={handleCalculate} className="gap-2">
                <Calculator className="h-4 w-4" />
                Calculate
              </Button>
              <Button type="button" variant="secondary" onClick={handleDownloadCSV} className="gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </Form>

        <div className="mt-8 space-y-6">
          {/* Primary Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Home Loan Interest ({interestPercentage}%)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(homeLoanInterest)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Remaining Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totalRemainingIncome)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Financial Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Total Income Before Loan</h4>
                    <p className="text-lg font-semibold mt-1">{formatCurrency(totalIncomeBeforeLoan)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Income After Loan Applied</h4>
                    <p className="text-lg font-semibold mt-1">{formatCurrency(incomeAfterLoan)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Income Including Home Loan Interest</h4>
                    <p className="text-lg font-semibold mt-1">{formatCurrency(incomeIncludingLoan)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Final Total</h4>
                    <p className={`text-lg font-semibold mt-1 ${finalTotal < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {formatCurrency(finalTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Income and Expenses Chart */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Income and Expenses Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ChartContainer
                data={watchedRows.map((row) => ({
                  month: row.month,
                  rent: row.rent,
                  expenses:
                    row.realtorFees +
                    row.homeInsurance +
                    row.propertyMaintenance +
                    row.councilLevy +
                    row.waterSewer +
                    row.electricity +
                    row.gas,
                  finalIncome: row.finalIncome,
                }))}
                config={{
                  // Chart configuration
                  rent: {
                    label: "Rental Income",
                    color: "hsl(142, 76%, 36%)" // Green
                  },
                  expenses: {
                    label: "Total Expenses",
                    color: "hsl(0, 84%, 60%)" // Red
                  },
                  finalIncome: {
                    label: "Final Income",
                    color: "hsl(217, 91%, 60%)" // Blue
                  }
                }}
              >
                <ChartGrid vertical={false} />
                <ChartXAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: string) => value.split(" ")[0].substring(0, 3)}
                />
                <ChartYAxis
                  tickCount={5}
                  tickFormatter={(value: number) => formatCurrency(value)}
                  width={80}
                />
                {/* Define chart configuration */}
                {(() => {
                  const chartConfig = {
                    rent: {
                      label: "Rental Income",
                      color: "hsl(142, 76%, 36%)" // Green
                    },
                    expenses: {
                      label: "Total Expenses",
                      color: "hsl(0, 84%, 60%)" // Red
                    },
                    finalIncome: {
                      label: "Final Income",
                      color: "hsl(217, 91%, 60%)" // Blue
                    }
                  }
                  return (
                    <>
                      <ChartLine
                        dataKey="rent"
                        stroke={chartConfig.rent.color}
                        strokeWidth={2}
                      />
                      <ChartLine
                        dataKey="expenses"
                        stroke={chartConfig.expenses.color}
                        strokeWidth={2}
                      />
                      <ChartLine
                        dataKey="finalIncome"
                        stroke={chartConfig.finalIncome.color}
                        strokeWidth={2.5}
                      />
                    </>
                  )
                })()}
                <ChartTooltip formatter={formatCurrency} />
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
        <p>Note: Final Income = (Rent + Tenant Paid Bills) - (All Expenses)</p>
        <p>Home Loan Interest is calculated as {interestPercentage}% of the total Final Income</p>
      </CardFooter>
    </Card>
  )
}
