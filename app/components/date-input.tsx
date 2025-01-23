import { format, isValid, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { DayPickerProvider, DayPickerProps } from "react-day-picker"
import React from "react"

interface DateInputProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label: string
  error?: string
}

export function DateInput({ value, onChange }: DateInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [errorState, setError] = React.useState<string | null>(null)

  // Update input value when controlled value changes
  React.useEffect(() => {
    if (value) {
      try {
        setInputValue(format(value, "dd/MM/yyyy"))
        setError(null)
      } catch (e) {
        console.error("Error formatting date:", e)
      }
    } else {
      setInputValue("")
      setError(null)
    }
  }, [value])

  const tryParseDate = (input: string): Date | null => {
    if (!input.trim()) return null

    // Clean the input - remove multiple spaces and common separators
    const cleanInput = input.trim()
      .replace(/\s+/g, ' ')
      .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '/')
      .replace(/\/+/g, '/')

    // Try different date formats
    const formats = [
      // Common Australian formats (DD/MM/YYYY)
      "dd/MM/yyyy",
      "d/MM/yyyy",
      "dd/M/yyyy",
      "d/M/yyyy",
      
      // With dashes
      "dd-MM-yyyy",
      "d-MM-yyyy",
      "dd-M-yyyy",
      "d-M-yyyy",
      
      // With dots
      "dd.MM.yyyy",
      "d.MM.yyyy",
      "dd.M.yyyy",
      "d.M.yyyy",
      
      // ISO format (YYYY-MM-DD)
      "yyyy-MM-dd",
      "yyyy/MM/dd",
      
      // Short year formats
      "dd/MM/yy",
      "d/MM/yy",
      "dd/M/yy",
      "d/M/yy",
      
      // Month first formats (US style)
      "MM/dd/yyyy",
      "M/dd/yyyy",
      "MM/d/yyyy",
      "M/d/yyyy",
      
      // Text month formats
      "dd MMM yyyy",
      "d MMM yyyy",
      "dd MMMM yyyy",
      "d MMMM yyyy",
      
      // Text month with commas
      "MMM dd, yyyy",
      "MMMM dd, yyyy",
      
      // Reverse formats
      "yyyy MMM dd",
      "yyyy MMMM dd"
    ]

    // First try the exact formats
    for (const dateFormat of formats) {
      try {
        const parsedDate = parse(cleanInput, dateFormat, new Date())
        if (isValid(parsedDate)) {
          // Validate the year is reasonable (between 1900 and 2100)
          const year = parsedDate.getFullYear()
          if (year >= 1900 && year <= 2100) {
            return parsedDate
          }
        }
      } catch {} // Ignore parsing errors and try next format
    }

    // If no format worked, try direct parsing
    const directDate = new Date(cleanInput)
    if (isValid(directDate)) {
      const year = directDate.getFullYear()
      if (year >= 1900 && year <= 2100) {
        return directDate
      }
    }

    // Try parsing potential Unix timestamp
    if (/^\d+$/.test(cleanInput)) {
      const timestamp = parseInt(cleanInput)
      const timestampDate = new Date(timestamp)
      if (isValid(timestampDate)) {
        const year = timestampDate.getFullYear()
        if (year >= 1900 && year <= 2100) {
          return timestampDate
        }
      }
    }

    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    if (!newValue.trim()) {
      onChange(null)
      setError(null)
      return
    }

    const parsedDate = tryParseDate(newValue)
    if (parsedDate) {
      onChange(parsedDate)
      setError(null)
    } else {
      setError("Please enter a valid date")
    }
  }

  // Configure default props for DayPicker
  const defaultProps: DayPickerProps = {
    mode: "single",
    selected: value || undefined,
    onSelect: (date) => onChange(date || null),
    fromYear: 2020,
    toYear: 2030,
    captionLayout: "dropdown"
  }

  return (
    <DayPickerProvider initialProps={defaultProps}>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="DD/MM/YYYY"
            className={cn(
              "flex-1",
              errorState && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "px-2",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={value || undefined}
                onSelect={(date) => onChange(date || null)}
                initialFocus
                fromYear={2020}
                toYear={2030}
              />
            </PopoverContent>
          </Popover>
        </div>
        {errorState && (
          <p className="text-sm text-red-500">{errorState}</p>
        )}
      </div>
    </DayPickerProvider>
  )
}
