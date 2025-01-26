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
import { updateAdvertisingFee } from "@/lib/redux/calculatorSlice"
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

export function AdvertisingFeeCalculator() {
  const dispatch = useDispatch()
  const form = useForm()

  const {
    useDates,
    advertisingCost,
    term,
    weeksRemaining,
    moveOutDate,
    agreementEndDate,
    calculatedFee,
    error
  } = useSelector((state: RootState) => state.calculator.advertisingFee)

  const [rawMoveOutDate, setRawMoveOutDate] = React.useState("")
  const [rawEndDate, setRawEndDate] = React.useState("")
  const [dateError, setDateError] = React.useState<string | null>(null)

  const handleCalculate = () => {
    // Reset any previous errors
    dispatch(updateAdvertisingFee({ error: null }))
    setDateError(null)

    // Validate advertising cost
    const adCost = parseFloat(advertisingCost)
    if (isNaN(adCost) || adCost <= 0) {
      dispatch(updateAdvertisingFee({ 
        error: "Please enter a valid advertising cost amount",
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
        dispatch(updateAdvertisingFee({ 
          error: "Please enter valid dates",
          calculatedFee: null 
        }))
        return
      }

      // Store the parsed dates
      dispatch(updateAdvertisingFee({
        moveOutDate: moveOutDateObj.toISOString(),
        agreementEndDate: endDateObj.toISOString()
      }))

      const weeksResult = calculateWeeksRemaining(moveOutDateObj, endDateObj)
      if (weeksResult.error || weeksResult.weeks === null) {
        setDateError(weeksResult.error)
        dispatch(updateAdvertisingFee({ 
          error: weeksResult.error || "Error calculating weeks",
          calculatedFee: null 
        }))
        return
      }
      remainingWeeks = weeksResult.weeks
    } else {
      remainingWeeks = parseFloat(weeksRemaining)
    }

    // Apply official formula
    const threeQuartersOfTermWeeks = Math.round(term * 0.75)
    const fee = (adCost * remainingWeeks) / threeQuartersOfTermWeeks

    // Track the calculation event
    gaEvent({
      action: 'calculate',
      category: 'advertising_fee',
      label: `Term: ${term} weeks, Cost: ${adCost}, Weeks Remaining: ${remainingWeeks}`,
      value: Math.round(fee * 100) / 100
    })

    dispatch(updateAdvertisingFee({ 
      calculatedFee: Math.round(fee * 100) / 100,
      error: null 
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Advertising Fee Calculator</CardTitle>
        <CardDescription>
          Calculate the advertising fee based on SACAT guidelines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <div>
              <Label>Agreed Term</Label>
              <Select 
                onValueChange={(value) => dispatch(updateAdvertisingFee({ term: parseInt(value) }))}
                defaultValue={term.toString()}
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

            <div>
              <Label>Advertising Cost ($)</Label>
              <Input
                type="number"
                value={advertisingCost}
                onChange={(e) => dispatch(updateAdvertisingFee({ advertisingCost: e.target.value }))}
                placeholder="Enter advertising cost"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={useDates}
                onCheckedChange={(checked) => dispatch(updateAdvertisingFee({ useDates: checked }))}
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
                      dispatch(updateAdvertisingFee({ moveOutDate: date?.toISOString() ?? null }))
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
                      dispatch(updateAdvertisingFee({ agreementEndDate: date?.toISOString() ?? null }))
                    }}
                    label={""}
                    error={dateError}
                  />
                </div>
                {/* Display calculated weeks if both dates are selected */}
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
                  onChange={(e) => dispatch(updateAdvertisingFee({ weeksRemaining: e.target.value }))}
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
              <div className="mt-4 p-4 bg-error rounded-lg">
                <p className="text-lg font-semibold">
                  {error}
                </p>
              </div>
            )}

            {calculatedFee !== null && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-lg font-semibold">
                  Calculated Fee: ${calculatedFee.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
