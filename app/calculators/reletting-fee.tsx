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
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { RootState } from "@/lib/redux/store"
import { updateRelettingFee } from "@/lib/redux/calculatorSlice"
import { event as gaEvent } from '@/lib/gtag'

const TERM_OPTIONS = [
  { label: "6 Months", weeks: 26 },
  { label: "1 Year", weeks: 52 },
  { label: "2 Years", weeks: 104 },
  { label: "3 Years", weeks: 156 },
]

export function RelettingFeeCalculator() {

  const dispatch = useDispatch()
  const {
    useDates,
    baseWeeklyRent,
    term,
    weeksRemaining,
    moveOutDate,
    agreementEndDate,
    calculatedFee
  } = useSelector((state: RootState) => state.calculator.relettingFee)
  
  const form = useForm()

  const calculateWeeksRemaining = (moveOut: Date, endDate: Date) => {
    // Validate dates
    if (moveOut > endDate) {
      throw new Error("Move out date cannot be after end date")
    }
    
    // Get the difference in milliseconds
    const diffTime = endDate.getTime() - moveOut.getTime()
    
    // Convert to days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    // Calculate complete weeks and remaining days
    const completeWeeks = Math.floor(diffDays / 7)
    const remainingDays = diffDays % 7
    
    // Add an extra week if remaining days are 4 or more
    return remainingDays >= 4 ? completeWeeks + 1 : completeWeeks
  }

  const calculateFee = () => {
    const baseRent = parseFloat(baseWeeklyRent)
    
    if (isNaN(baseRent)) {
      return
    }
  
    // 1. Calculate weekly rent with GST
    const gstAmount = baseRent * 0.10
    const weeklyRentWithGST = baseRent + gstAmount
  
    // 2. Calculate maximum reletting fee (2 weeks rent with GST)
    const twoWeeksRentWithGST = weeklyRentWithGST * 2
  
    const remainingWeeks = useDates && moveOutDate && agreementEndDate
      ? calculateWeeksRemaining(new Date(moveOutDate), new Date(agreementEndDate))
      : parseFloat(weeksRemaining)
  
    if (isNaN(remainingWeeks)) {
      return
    }
  
    // Ensure term is available and valid
    if (!term) {
      console.error('Term is not selected');
      return;
    }
  
    // Calculate three quarters term
    const threeQuartersTerm = Math.round(term * 0.75)
  
    // 3 & 4. Apply the formula: (2 weeks rent × remaining weeks) ÷ (3/4 term)
    const relettingFee = (twoWeeksRentWithGST * remainingWeeks) / threeQuartersTerm

      // Add the tracking event here
    gaEvent({
    action: 'calculate',
    category: 'reletting_fee',
    label: `Term: ${term} weeks, Base Rent: $${baseRent}`,
    value: Math.round(relettingFee * 100) / 100
  })
  
    dispatch(updateRelettingFee({
      calculatedFee: {
        weeklyRentWithGST: Math.round(weeklyRentWithGST * 100) / 100,
        maximumRelettingFee: Math.round(relettingFee * 100) / 100
      }
    }))
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !moveOutDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {moveOutDate ? format(new Date(moveOutDate), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={moveOutDate ? new Date(moveOutDate) : undefined}
            onSelect={(date) => dispatch(updateRelettingFee({ moveOutDate: date?.toISOString() || null }))}
          />
        </PopoverContent>
      </Popover>
    </div>
    <div className="flex flex-col space-y-2">
      <Label>Agreement End Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !agreementEndDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {agreementEndDate ? format(new Date(agreementEndDate), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={agreementEndDate ? new Date(agreementEndDate) : undefined}
            onSelect={(date) => dispatch(updateRelettingFee({ agreementEndDate: date?.toISOString() || null }))}
          />
        </PopoverContent>
      </Popover>
    </div>
    {/* Add calculated weeks display here */}
    {moveOutDate && agreementEndDate && (
      <div className="rounded-md bg-muted px-3 py-2">
        <p className="text-sm">
          Calculated weeks remaining:{' '}
          <span className="font-medium">
            {calculateWeeksRemaining(new Date(moveOutDate), new Date(agreementEndDate))}
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

            <Button onClick={calculateFee} type="button">
              Calculate Fee
            </Button>

            {calculatedFee !== null && (
              <div className="mt-4 p-4 bg-secondary rounded-lg space-y-2">
                <p className="font-semibold">
                  Weekly Rent (incl. GST): ${calculatedFee.weeklyRentWithGST}
                </p>
                <p className="text-lg font-semibold">
                  Maximum Reletting Fee: ${calculatedFee.maximumRelettingFee}
                </p>
              </div>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
