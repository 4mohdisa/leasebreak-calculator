import { differenceInDays, isValid } from 'date-fns'

/**
 * Safely creates a Date object from various input types
 * @param date The date input (string, Date, or null)
 * @returns A valid Date object or null if the input is invalid
 */
export function createSafeDate(date: string | Date | null): Date | null {
  if (!date) return null
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    return isValid(dateObj) ? dateObj : null
  } catch {
    return null
  }
}

/**
 * Calculates the number of weeks remaining between two dates
 * @param moveOut The move out date
 * @param endDate The end date of the agreement
 * @returns The number of complete weeks, with an extra week added if there are 5 or more remaining days
 * @throws Error if moveOut date is after endDate or if either date is invalid
 */
export function calculateWeeksRemaining(moveOut: Date | string | null, endDate: Date | string | null): number {
  const moveOutDate = createSafeDate(moveOut)
  const agreementEndDate = createSafeDate(endDate)

  // Validate dates
  if (!moveOutDate || !agreementEndDate) {
    throw new Error("Invalid date provided")
  }

  if (moveOutDate > agreementEndDate) {
    throw new Error("Move out date cannot be after end date")
  }
  
  // Get the difference in days
  const diffDays = differenceInDays(agreementEndDate, moveOutDate)
  
  // Calculate complete weeks and remaining days
  const completeWeeks = Math.floor(diffDays / 7)
  const remainingDays = diffDays % 7
  
  // Add an extra week if there are 5 or more remaining days
  return completeWeeks + (remainingDays >= 5 ? 1 : 0)
}
