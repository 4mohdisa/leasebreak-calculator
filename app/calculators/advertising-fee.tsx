"use client"

import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateInput } from "@/app/components/date-input"
import { RootState } from "@/lib/redux/store"
import { updateAdvertisingFee } from "@/lib/redux/calculatorSlice"
import { event as gaEvent } from '@/lib/gtag'
import { calculateWeeksRemaining } from '@/lib/helpers/date-helpers'
import { Button } from "react-day-picker"

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
    calculatedFee
  } = useSelector((state: RootState) => state.calculator.advertisingFee)

  const calculateFee = () => {
    const threeQuartersOfTermWeeks = Math.round(term * 0.75)
    const remainingWeeks = useDates && moveOutDate && agreementEndDate
      ? calculateWeeksRemaining(new Date(moveOutDate), new Date(agreementEndDate))
      : parseFloat(weeksRemaining)
    
    const adCost = parseFloat(advertisingCost)
    
    if (isNaN(adCost) || isNaN(remainingWeeks)) {
      return
    }
  
    // Apply official formula
    const fee = (adCost * remainingWeeks) / threeQuartersOfTermWeeks

  // Track the calculation event
  gaEvent({
    action: 'calculate',
    category: 'advertising_fee',
    label: `Term: ${term} weeks, Cost: ${adCost}, Weeks Remaining: ${remainingWeeks}`,
    value: Math.round(fee * 100) / 100
  })
  
    dispatch(updateAdvertisingFee({ calculatedFee: Math.round(fee * 100) / 100 }))
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
                    onChange={(date) => dispatch(updateAdvertisingFee({ moveOutDate: date?.toISOString() ?? null }))} label={""}                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>Agreement End Date</Label>
                  <DateInput
                    value={agreementEndDate ? new Date(agreementEndDate) : null}
                    onChange={(date) => dispatch(updateAdvertisingFee({ agreementEndDate: date?.toISOString() ?? null }))} label={""}                  />
                </div>
                {/* Display calculated weeks if both dates are selected */}
                {moveOutDate && agreementEndDate && (
                  <div className="rounded-md bg-muted px-3 py-2">
                    <p className="text-sm">
                      Calculated weeks remaining:{' '}
                      <span className="font-medium">
                        {moveOutDate && agreementEndDate ? calculateWeeksRemaining(new Date(moveOutDate), new Date(agreementEndDate)) : 0}
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

            <Button onClick={calculateFee} type="button">
              Calculate Fee
            </Button>

            {calculatedFee !== null && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-lg font-semibold">
                  Calculated Advertising Fee: ${calculatedFee}
                </p>
              </div>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
