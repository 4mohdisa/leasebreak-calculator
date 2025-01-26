"use client"

import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateInput } from "@/app/components/date-input"
import { RootState } from "@/lib/redux/store"
import { updateRelettingFee } from "@/lib/redux/calculatorSlice"
import { event as gaEvent } from '@/lib/gtag'
import { calculateWeeksRemaining, createSafeDate } from '@/lib/helpers/date-helpers'
import { parse, isValid } from 'date-fns'
import React from "react"

const TERM_OPTIONS = [
  { label: "6 Months", weeks: 26 },
  { label: "1 Year", weeks: 52 },
  { label: "2 Years", weeks: 104 },
  { label: "3 Years", weeks: 156 },
]

export function RelettingFeeCalculator() {

  const dispatch = useDispatch()
  const form = useForm()

  const {
    useDates,
    baseWeeklyRent,
    term,
    weeksRemaining,
    moveOutDate,
    agreementEndDate,
    calculatedFee,
    error
  } = useSelector((state: RootState) => state.calculator.relettingFee)

  const [rawMoveOutDate, setRawMoveOutDate] = React.useState("")
  const [rawEndDate, setRawEndDate] = React.useState("")
  const [dateError, setDateError] = React.useState<string | null>(null)

  const handleCalculate = () => {
    // Reset any previous errors
    dispatch(updateRelettingFee({ error: null }))
    setDateError(null)

    // Validate base weekly rent
    const baseRent = parseFloat(baseWeeklyRent)
    if (isNaN(baseRent) || baseRent <= 0) {
      dispatch(updateRelettingFee({ 
        error: "Please enter a valid weekly rent amount",
        calculatedFee: null 
      }))
      return
    }

    // Calculate and validate remaining weeks
    let remainingWeeks = 0
    if (useDates) {
      // Try to parse the dates
      let moveOutDateObj = null
      let endDateObj = null

      try {
        if (rawMoveOutDate) {
          moveOutDateObj = parse(rawMoveOutDate, "dd/MM/yyyy", new Date())
          if (!isValid(moveOutDateObj)) {
            moveOutDateObj = createSafeDate(rawMoveOutDate)
          }
        }
        if (rawEndDate) {
          endDateObj = parse(rawEndDate, "dd/MM/yyyy", new Date())
          if (!isValid(endDateObj)) {
            endDateObj = createSafeDate(rawEndDate)
          }
        }
      } catch (e) {
        // Handle parsing errors
      }

      if (!moveOutDateObj || !endDateObj) {
        setDateError("Please enter valid dates in DD/MM/YYYY format")
        dispatch(updateRelettingFee({ 
          error: "Please enter valid dates",
          calculatedFee: null 
        }))
        return
      }

      // Store the parsed dates
      dispatch(updateRelettingFee({
        moveOutDate: moveOutDateObj.toISOString(),
        agreementEndDate: endDateObj.toISOString()
      }))

      const weeksResult = calculateWeeksRemaining(moveOutDateObj, endDateObj)
      if (weeksResult.error || weeksResult.weeks === null) {
        setDateError(weeksResult.error)
        dispatch(updateRelettingFee({ 
          error: weeksResult.error || "Error calculating weeks",
          calculatedFee: null 
        }))
        return
      }
      remainingWeeks = weeksResult.weeks
    } else {
      remainingWeeks = parseFloat(weeksRemaining)
    }

    if (isNaN(remainingWeeks) || remainingWeeks <= 0) {
      dispatch(updateRelettingFee({ 
        error: "Remaining weeks must be greater than 0",
        calculatedFee: null 
      }))
      return
    }

    // Validate term
    if (!term || term <= 0) {
      dispatch(updateRelettingFee({ 
        error: "Please select a valid term",
        calculatedFee: null 
      }))
      return
    }

    try {
      // Calculate GST inclusive weekly rent (10% GST)
      const weeklyRentWithGST = baseRent * 1.1

      // Calculate two weeks rent with GST
      const twoWeeksRentWithGST = weeklyRentWithGST * 2

      // Calculate three quarters term
      const threeQuartersTerm = Math.round(term * 0.75)

      // Calculate the reletting fee
      const relettingFee = (twoWeeksRentWithGST * remainingWeeks) / threeQuartersTerm

      // Add the tracking event
      gaEvent({
        action: 'calculate',
        category: 'reletting_fee',
        label: `Term: ${term} weeks, Base Rent: $${baseRent}, Weeks Remaining: ${remainingWeeks}`,
        value: Math.round(relettingFee * 100) / 100
      })

      // Update state with calculated values
      dispatch(updateRelettingFee({
        calculatedFee: {
          weeklyRentWithGST: Math.round(weeklyRentWithGST * 100) / 100,
          maximumRelettingFee: Math.round(relettingFee * 100) / 100
        },
        error: null
      }))
    } catch (error) {
      console.error('Calculation error:', error)
      dispatch(updateRelettingFee({ 
        error: "An error occurred during calculation",
        calculatedFee: null 
      }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Reletting Fee Calculator</CardTitle>
        <CardDescription>
          Calculate the maximum reletting fee based on SACAT guidelines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <div>
              <Label>Base Weekly Rent (excl. GST)</Label>
              <Input
                type="number"
                value={baseWeeklyRent}
                onChange={(e) => dispatch(updateRelettingFee({ baseWeeklyRent: e.target.value }))}
                placeholder="Enter base weekly rent"
              />
            </div>

            <div>
              <Label>Agreed Term</Label>
              <Select 
                onValueChange={(value) => dispatch(updateRelettingFee({ term: parseInt(value) }))}
                defaultValue={term?.toString() || "52"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term length" />
                </SelectTrigger>
                <SelectContent>
                  {TERM_OPTIONS.map((option) => (
                    <SelectItem key={option.weeks} value={option.weeks.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={useDates}
                onCheckedChange={(checked) => dispatch(updateRelettingFee({ useDates: checked }))}
              />
              <Label>Use dates instead of weeks</Label>
            </div>

            {useDates ? (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label>Move Out Date</Label>
                  <DateInput
                    value={moveOutDate ? new Date(moveOutDate) : null}
                    onChange={(date, raw) => {
                      if (raw !== undefined) setRawMoveOutDate(raw)
                      dispatch(updateRelettingFee({ moveOutDate: date?.toISOString() ?? null }))
                    }}
                    label={""}
                    error={dateError}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>Agreement End Date</Label>
                  <DateInput
                    value={agreementEndDate ? new Date(agreementEndDate) : null}
                    onChange={(date, raw) => {
                      if (raw !== undefined) setRawEndDate(raw)
                      dispatch(updateRelettingFee({ agreementEndDate: date?.toISOString() ?? null }))
                    }}
                    label={""}
                    error={dateError}
                  />
                </div>
                {/* Add calculated weeks display here */}
                {moveOutDate && agreementEndDate && (
                  <div className="rounded-md bg-muted px-3 py-2">
                    <p className="text-sm">
                      Calculated weeks remaining:{' '}
                      <span className="font-medium">
                        {calculateWeeksRemaining(new Date(moveOutDate), new Date(agreementEndDate)).weeks ?? 0}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Label>Weeks Remaining</Label>
                <Input
                  type="number"
                  value={weeksRemaining}
                  onChange={(e) => dispatch(updateRelettingFee({ weeksRemaining: e.target.value }))}
                  placeholder="Enter weeks remaining"
                />
              </div>
            )}

            <Button 
              onClick={handleCalculate} 
              className="w-full mt-4"
            >
              Calculate Fee
            </Button>

            {error && (
              <div className="mt-4 p-4 bg-destructive/15 rounded-lg">
                <p className="text-destructive font-medium">
                  {error}
                </p>
              </div>
            )}

            {calculatedFee && (
              <div className="mt-4 p-4 bg-secondary rounded-lg space-y-2">
                <p className="font-semibold">
                  Weekly Rent (incl. GST): ${calculatedFee.weeklyRentWithGST.toFixed(2)}
                </p>
                <p className="text-lg font-semibold">
                  Maximum Reletting Fee: ${calculatedFee.maximumRelettingFee.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
