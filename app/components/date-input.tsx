import { format, isValid } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { DayPickerProvider } from "react-day-picker"
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
    // If empty, return null
    if (!input.trim()) return null

    // First try direct Date parsing
    const directDate = new Date(input)
    if (isValid(directDate)) {
      return directDate
    }

    // If direct parsing fails, return null
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
      setError("Invalid date format")
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-1">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="DD/MM/YYYY"
            className={cn(
              "w-full",
              errorState && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "ml-2 px-2",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
            <DayPickerProvider>
              <Calendar
                mode="single"
                selected={value || undefined}
                onSelect={(date) => {
                  onChange(date || null)
                  setError(null)
                }}
              />
              </DayPickerProvider>
            </PopoverContent>
          </Popover>
        </div>
        {(errorState || error) && (
          <p className="text-sm text-red-500">
            {errorState || error}
          </p>
        )}
      </div>
    </div>
  )
}
