"use client"

import { useState } from "react"
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

const TERM_OPTIONS = [
  { label: "6 Months", weeks: 26 },
  { label: "1 Year", weeks: 52 },
  { label: "2 Years", weeks: 104 },
  { label: "3 Years", weeks: 156 },
]

export function AdvertisingFeeCalculator() {
  const [useDates, setUseDates] = useState(false)
  const [term, setTerm] = useState<number>(52) // Default to 1 year
  const [advertisingCost, setAdvertisingCost] = useState<string>("")
  const [weeksRemaining, setWeeksRemaining] = useState<string>("")
  const [moveOutDate, setMoveOutDate] = useState<Date>()
  const [agreementEndDate, setAgreementEndDate] = useState<Date>()
  const [calculatedFee, setCalculatedFee] = useState<number | null>(null)

  const calculateWeeksRemaining = (moveOut: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - moveOut.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.round(diffDays / 7)
  }

  const calculateFee = () => {
    const threeQuartersOfTermWeeks = Math.round(term * 0.75)
    const remainingWeeks = useDates && moveOutDate && agreementEndDate
      ? calculateWeeksRemaining(moveOutDate, agreementEndDate)
      : parseFloat(weeksRemaining)
    
    const adCost = parseFloat(advertisingCost)
    
    if (isNaN(adCost) || isNaN(remainingWeeks)) {
      return
    }

    const totalAdvertisingCostForRemainingWeeks = adCost * remainingWeeks
    const finalFee = totalAdvertisingCostForRemainingWeeks / threeQuartersOfTermWeeks
    setCalculatedFee(Math.round(finalFee * 100) / 100)
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
        <Form>
          <div className="space-y-4">
            <div>
              <Label>Agreed Term</Label>
              <Select 
                onValueChange={(value) => setTerm(parseInt(value))}
                defaultValue="52"
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
                onChange={(e) => setAdvertisingCost(e.target.value)}
                placeholder="Enter advertising cost"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={useDates}
                onCheckedChange={setUseDates}
              />
              <Label>Use dates instead of weeks</Label>
            </div>

            {!useDates ? (
              <div>
                <Label>Weeks Remaining</Label>
                <Input
                  type="number"
                  value={weeksRemaining}
                  onChange={(e) => setWeeksRemaining(e.target.value)}
                  placeholder="Enter weeks remaining"
                />
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Move-Out Date</Label>
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
                        {moveOutDate ? format(moveOutDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={moveOutDate}
                        onSelect={setMoveOutDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
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
                        {agreementEndDate ? format(agreementEndDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={agreementEndDate}
                        onSelect={setAgreementEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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
