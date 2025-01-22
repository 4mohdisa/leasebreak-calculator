import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CalculatorState {
  version: number
  advertisingFee: {
    useDates: boolean
    term: number
    advertisingCost: string
    weeksRemaining: string
    moveOutDate: string | null
    agreementEndDate: string | null
    calculatedFee: number | null
    error: string | null
    isLoading: boolean
  }
  relettingFee: {
    useDates: boolean
    baseWeeklyRent: string
    term: number
    weeksRemaining: string
    moveOutDate: string | null
    agreementEndDate: string | null
    calculatedFee: {
      weeklyRentWithGST: number
      maximumRelettingFee: number
    } | null
    error: string | null
    isLoading: boolean
  }
}

const initialState: CalculatorState = {
  version: 1,
  advertisingFee: {
    useDates: false,
    term: 52,
    advertisingCost: '',
    weeksRemaining: '',
    moveOutDate: null,
    agreementEndDate: null,
    calculatedFee: null,
    error: null,
    isLoading: false
  },
  relettingFee: {
    useDates: false,
    baseWeeklyRent: '',
    term: 52,
    weeksRemaining: '',
    moveOutDate: null,
    agreementEndDate: null,
    calculatedFee: null,
    error: null,
    isLoading: false
  },
}

export const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    updateAdvertisingFee: (state, action: PayloadAction<Partial<typeof initialState.advertisingFee>>) => {
      state.advertisingFee = { 
        ...state.advertisingFee, 
        ...action.payload,
        error: null // Clear any previous errors
      }
    },
    updateRelettingFee: (state, action: PayloadAction<Partial<typeof initialState.relettingFee>>) => {
      state.relettingFee = { 
        ...state.relettingFee, 
        ...action.payload,
        error: null // Clear any previous errors
      }
    },
    setAdvertisingFeeError: (state, action: PayloadAction<string>) => {
      state.advertisingFee.error = action.payload
      state.advertisingFee.isLoading = false
    },
    setRelettingFeeError: (state, action: PayloadAction<string>) => {
      state.relettingFee.error = action.payload
      state.relettingFee.isLoading = false
    },
    setAdvertisingFeeLoading: (state, action: PayloadAction<boolean>) => {
      state.advertisingFee.isLoading = action.payload
      if (action.payload) {
        state.advertisingFee.error = null
      }
    },
    setRelettingFeeLoading: (state, action: PayloadAction<boolean>) => {
      state.relettingFee.isLoading = action.payload
      if (action.payload) {
        state.relettingFee.error = null
      }
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
  setAdvertisingFeeError,
  setRelettingFeeError,
  setAdvertisingFeeLoading,
  setRelettingFeeLoading,
  resetAdvertisingFee,
  resetRelettingFee,
} = calculatorSlice.actions

export default calculatorSlice.reducer
