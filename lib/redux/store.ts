import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import calculatorReducer from './calculatorSlice'
import landlordIncomeReducer from './landlordIncomeSlice'
import storage from './customStorage'

const calculatorPersistConfig = {
  key: 'calculator',
  storage,
  whitelist: ['calculator']
}

const landlordIncomePersistConfig = {
  key: 'landlordIncome',
  storage,
  whitelist: ['rows', 'interestPercentage']
}

const persistedCalculatorReducer = persistReducer(calculatorPersistConfig, calculatorReducer)
const persistedLandlordIncomeReducer = persistReducer(landlordIncomePersistConfig, landlordIncomeReducer)

export const store = configureStore({
  reducer: {
    calculator: persistedCalculatorReducer,
    landlordIncome: persistedLandlordIncomeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch