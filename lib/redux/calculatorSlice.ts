import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CalculatorState {
  advertisingFee: {
    useDates: boolean
    term: number
    advertisingCost: string
    weeksRemaining: string
    moveOutDate: string | null
    agreementEndDate: string | null
    calculatedFee: number | null
  }
  relettingFee: {
    useDates: boolean
    baseWeeklyRent: string
    term: number  // Defined in interface
    weeksRemaining: string
    moveOutDate: string | null
    agreementEndDate: string | null
    calculatedFee: {
      weeklyRentWithGST: number
      maximumRelettingFee: number
    } | null
  }
}

const initialState: CalculatorState = {
  advertisingFee: {
    useDates: false,
    term: 52,
    advertisingCost: '',
    weeksRemaining: '',
    moveOutDate: null,
    agreementEndDate: null,
    calculatedFee: null,
  },
  relettingFee: {
    useDates: false,
    baseWeeklyRent: '',
    term: 52,     // Add this line to match interface
    weeksRemaining: '',
    moveOutDate: null,
    agreementEndDate: null,
    calculatedFee: null,
  },
}

// Rest of the code remains the same

export const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    updateAdvertisingFee: (state, action: PayloadAction<Partial<typeof initialState.advertisingFee>>) => {
      state.advertisingFee = { ...state.advertisingFee, ...action.payload }
    },
    updateRelettingFee: (state, action: PayloadAction<Partial<typeof initialState.relettingFee>>) => {
      state.relettingFee = { ...state.relettingFee, ...action.payload }
    },
    resetAdvertisingFee: (state) => {
      state.advertisingFee = initialState.advertisingFee
    },
    resetRelettingFee: (state) => {
      state.relettingFee = initialState.relettingFee
    },
  },
})

export const {
  updateAdvertisingFee,
  updateRelettingFee,
  resetAdvertisingFee,
  resetRelettingFee,
} = calculatorSlice.actions

export default calculatorSlice.reducer
