# Rent Calculator Implementation Guide

## Core Functionality
Calculator that computes move-in costs based on weekly rent and bond requirements.

## Inputs
- Weekly Rent Amount (number input)

## Automatic Calculations
1. **2 Weeks Rent Advance**
   ```typescript
   twoWeeksAdvance = weeklyRent * 2
   ```

2. **Bond Amount**
   ```typescript
   bond = weeklyRent <= 800 ? weeklyRent * 4 : weeklyRent * 6
   ```

3. **Total Move-in Cost**
   ```typescript
   totalCost = twoWeeksAdvance + bond
   ```

## UI Requirements
- Match existing calculator style
- Part of main tabs interface
- Form validation for weekly rent input
- Error display for invalid inputs
- Display calculated values in real-time

## Component Structure
```typescript
interface RentCalculatorState {
  weeklyRent: string;
  hasPetBond: boolean;
  calculatedFee: {
    twoWeeksAdvance: number;
    bond: number;
    totalCost: number;
  } | null;
  error: string | null;
}
```

## Integration
Create new file: `app/calculators/rent-calculator.tsx` following style of `reletting-fee.tsx`

## Validation Rules
- Weekly rent must be positive number
- Show inline error messages
- Disable calculation if invalid input

Follow existing Redux state management pattern and UI component structure.