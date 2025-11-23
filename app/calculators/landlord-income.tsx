"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calculator, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { setRows, addRow, removeRow, setInterestPercentage, updateCalculations } from "@/lib/redux/landlordIncomeSlice"
import { LandlordIncomeChart } from "@/components/landlord-income-chart"
import { trackButtonClick, trackCalculation, trackDownload } from "@/lib/ga-events"
import React from "react"

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

// Generate months for the current and next year
function generateMonthOptions(): string[] {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
  const headers = [
    "Month", "Rent", "Realtor Fees", "Home Insurance", 
    "Property Maintenance", "Council & Emergency Levy", 
    "Water & Sewer", "Electricity", "Gas", 
    "Tenant Paid Bills", "Final Income"
  ]

  const data = rows.map((row) => [
    row.month, row.rent, row.realtorFees, row.homeInsurance,
    row.propertyMaintenance, row.councilLevy, row.waterSewer,
    row.electricity, row.gas, row.tenantPaidBills, row.finalIncome
  ])

  data.push([])
  data.push([`Home Loan Interest (${interestPercentage}%)`, "", "", "", "", "", "", "", "", "", homeLoanInterest])
  data.push(["Total Remaining Income", "", "", "", "", "", "", "", "", "", totalRemainingIncome])

  const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")
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
  const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set())
  
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

  const form = useForm({ defaultValues })
  const { control, watch, setValue } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  })

  const watchedRows = watch("rows")

  // Toggle card expansion
  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

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

  // Handle calculate button click
  const handleCalculate = () => {
    const updatedRows = watchedRows.map(row => ({
      ...row,
      finalIncome: calculateRowFinalIncome(row)
    }))
    
    updatedRows.forEach((row, index) => {
      setValue(`rows.${index}.finalIncome`, row.finalIncome)
    })
    
    dispatch(setRows(updatedRows))
    dispatch(updateCalculations())

    trackCalculation('landlord_income', {
      num_rows: watchedRows.length,
      total_income: totalIncomeBeforeLoan,
      interest_percentage: interestPercentage
    })
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
    setExpandedCards(prev => new Set(prev).add(newRow.id))
    trackButtonClick('add_row', 'landlord_income')
  }

  // Download as CSV
  const handleDownloadCSV = () => {
    downloadLandlordIncomeCSV(rows, homeLoanInterest, totalRemainingIncome, interestPercentage)
    trackDownload('csv', 'landlord_income_data')
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
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
          <div className="space-y-4">
            {/* Monthly Cards */}
            {fields.map((field, index) => {
              const isExpanded = expandedCards.has(field.id)
              const currentRow = watchedRows[index]
              
              return (
                <Card key={field.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Controller
                          control={control}
                          name={`rows.${index}.month`}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-full max-w-[200px]">
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
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Net Income</p>
                          <p className={`text-lg font-bold ${currentRow.finalIncome < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {formatCurrency(currentRow.finalIncome)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCard(field.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-4 pt-0">
                      {/* Income Section */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-green-600">Income</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <FormLabel className="text-xs">Rent</FormLabel>
                            <Controller
                              control={control}
                              name={`rows.${index}.rent`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <FormLabel className="text-xs">Tenant Paid Bills</FormLabel>
                            <Controller
                              control={control}
                              name={`rows.${index}.tenantPaidBills`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expenses Section */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-red-600">Expenses</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <FormLabel className="text-xs">Realtor Fees</FormLabel>
                            <Controller
                              control={control}
                              name={`rows.${index}.realtorFees`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <FormLabel className="text-xs">Home Insurance</FormLabel>
                            <Controller
                              control={control}
                              name={`rows.${index}.homeInsurance`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <FormLabel className="text-xs">Property Maintenance</FormLabel>
                            <Controller
                              control={control}
                              name={`rows.${index}.propertyMaintenance`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <FormLabel className="text-xs">Council & Emergency Levy</FormLabel>
                            <Controller
                              control={control}
                              name={`rows.${index}.councilLevy`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <FormLabel className="text-xs">Water & Sewer</FormLabel>
                            <Controller
                              control={control}
                              name={`rows.${index}.waterSewer`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <FormLabel className="text-xs">Electricity</FormLabel>
                            <Controller
                              control={control}
                              name={`rows.${index}.electricity`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <FormLabel className="text-xs">Gas</FormLabel>
                            <Controller
                              control={control}
                              name={`rows.${index}.gas`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            remove(index)
                            dispatch(removeRow(index))
                            setExpandedCards(prev => {
                              const newSet = new Set(prev)
                              newSet.delete(field.id)
                              return newSet
                            })
                          }}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Month
                        </Button>
                      )}
                    </CardContent>
                  )}
                </Card>
              )
            })}

            {/* Add Month Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRow}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Month
            </Button>

            {/* Home Loan Interest Rate */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <FormLabel htmlFor="interestPercentage" className="sm:min-w-[200px]">
                    Home Loan Interest Rate:
                  </FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      id="interestPercentage"
                      type="number"
                      value={interestPercentage}
                      onChange={(e) => dispatch(setInterestPercentage(Number.parseFloat(e.target.value) || 0))}
                      className="w-24"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span>%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                onClick={handleCalculate}
                className="flex-1 gap-2"
              >
                <Calculator className="h-4 w-4" />
                Calculate
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleDownloadCSV}
                className="flex-1 gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </Form>

        {/* Summary Cards */}
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Home Loan Interest ({interestPercentage}%)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(homeLoanInterest)}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Remaining Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRemainingIncome)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Financial Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Total Income Before Loan</span>
                  <span className="font-semibold">{formatCurrency(totalIncomeBeforeLoan)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Income After Loan Applied</span>
                  <span className="font-semibold">{formatCurrency(incomeAfterLoan)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Income Including Home Loan Interest</span>
                  <span className="font-semibold">{formatCurrency(incomeIncludingLoan)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">Final Total</span>
                  <span className={`text-lg font-bold ${finalTotal < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income and Expenses Chart */}
        <div className="mt-6">
          <LandlordIncomeChart
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
            totalIncome={totalIncomeBeforeLoan}
            previousTotalIncome={rows.length > 1 ? rows[rows.length - 2].finalIncome : undefined}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-muted-foreground space-y-1">
        <p>• Final Income = (Rent + Tenant Paid Bills) - (All Expenses)</p>
        <p>• Home Loan Interest is calculated as {interestPercentage}% of the total Final Income</p>
      </CardFooter>
    </Card>
  )
}
