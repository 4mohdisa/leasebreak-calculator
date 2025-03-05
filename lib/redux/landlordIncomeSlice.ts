import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IncomeRow {
  id: string
  month: string
  rent: number
  realtorFees: number
  homeInsurance: number
  propertyMaintenance: number
  councilLevy: number
  waterSewer: number
  electricity: number
  gas: number
  tenantPaidBills: number
  finalIncome: number
}

interface LandlordIncomeState {
  rows: IncomeRow[]
  homeLoanInterest: number
  interestPercentage: number
  totalRemainingIncome: number
  totalIncomeBeforeLoan: number
  incomeAfterLoan: number
  incomeIncludingLoan: number
  finalTotal: number
}

const initialState: LandlordIncomeState = {
  rows: [],
  homeLoanInterest: 0,
  interestPercentage: 3.5,
  totalRemainingIncome: 0,
  totalIncomeBeforeLoan: 0,
  incomeAfterLoan: 0,
  incomeIncludingLoan: 0,
  finalTotal: 0
}

export const landlordIncomeSlice = createSlice({
  name: 'landlordIncome',
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<IncomeRow[]>) => {
      state.rows = action.payload
    },
    updateRow: (state, action: PayloadAction<{ index: number; row: Partial<IncomeRow> }>) => {
      const { index, row } = action.payload
      state.rows[index] = { ...state.rows[index], ...row }
    },
    addRow: (state, action: PayloadAction<IncomeRow>) => {
      state.rows.push(action.payload)
    },
    removeRow: (state, action: PayloadAction<number>) => {
      state.rows.splice(action.payload, 1)
    },
    setInterestPercentage: (state, action: PayloadAction<number>) => {
      state.interestPercentage = action.payload
    },
    updateCalculations: (state) => {
      // Calculate total income (rent + tenant paid bills - expenses)
      const totalIncome = state.rows.reduce((sum, row) => sum + (row.finalIncome || 0), 0)
      
      // Calculate home loan interest
      const calculatedHomeLoanInterest = totalIncome * (state.interestPercentage / 100)
      
      // Income before loan interest is applied
      const calculatedIncomeBeforeLoan = totalIncome
      
      // Income after deducting loan interest
      const calculatedIncomeAfterLoan = totalIncome - calculatedHomeLoanInterest
      
      // Total cost including loan interest
      const calculatedIncomeIncludingLoan = -calculatedHomeLoanInterest
      
      // Final total is the income after loan
      const calculatedFinalTotal = calculatedIncomeAfterLoan

      // Update state with rounded values
      state.totalIncomeBeforeLoan = Number(calculatedIncomeBeforeLoan.toFixed(2))
      state.homeLoanInterest = Number(calculatedHomeLoanInterest.toFixed(2))
      state.incomeAfterLoan = Number(calculatedIncomeAfterLoan.toFixed(2))
      state.incomeIncludingLoan = Number(calculatedIncomeIncludingLoan.toFixed(2))
      state.finalTotal = Number(calculatedFinalTotal.toFixed(2))
      state.totalRemainingIncome = Number(calculatedIncomeAfterLoan.toFixed(2))
    },
    resetCalculator: () => {
      return initialState
    }
  }
})

export const {
  setRows,
  updateRow,
  addRow,
  removeRow,
  setInterestPercentage,
  updateCalculations,
  resetCalculator
} = landlordIncomeSlice.actions

export default landlordIncomeSlice.reducer
