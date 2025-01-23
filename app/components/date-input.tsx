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

export function DateInput({ value, onChange, error }: DateInputProps) {
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

    // Try different date formats
    const formats = [
      "dd/MM/yyyy",
      "d/M/yyyy",
      "dd-MM-yyyy",
      "d-M-yyyy",
      "yyyy-MM-dd",
      "dd.MM.yyyy",
      "d.M.yyyy"
    ]

    for (const dateFormat of formats) {
      try {
        const parsedDate = parse(input, dateFormat, new Date())
        if (isValid(parsedDate)) {
          return parsedDate
        }
      } catch (e) {
        // Continue to next format
      }
    }

    // Try direct Date parsing as last resort
    const directDate = new Date(input)
    if (isValid(directDate)) {
      return directDate
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
