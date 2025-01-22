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
import { updateAdvertisingFee } from "@/lib/redux/calculatorSlice"

const TERM_OPTIONS = [
  { label: "6 Months", weeks: 26 },
  { label: "1 Year", weeks: 52 },
  { label: "2 Years", weeks: 104 },
  { label: "3 Years", weeks: 156 },
]

export function AdvertisingFeeCalculator() {
  const dispatch = useDispatch()
  const {
    useDates,
    term,
    advertisingCost,
    weeksRemaining,
    moveOutDate,
    agreementEndDate,
    calculatedFee
  } = useSelector((state: RootState) => state.calculator.advertisingFee)
  
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
            onSelect={(date) => dispatch(updateAdvertisingFee({ moveOutDate: date?.toISOString() || null }))}
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
            onSelect={(date) => dispatch(updateAdvertisingFee({ agreementEndDate: date?.toISOString() || null }))}
          />
        </PopoverContent>
      </Popover>
    </div>
    {/* Display calculated weeks if both dates are selected */}
    {moveOutDate && agreementEndDate && (
      <div className="mt-2 text-sm text-muted-foreground">
        <p>
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
