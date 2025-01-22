import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import calculatorReducer from './calculatorSlice'
import storage from './customStorage'

interface CalculatorState {
  version: number;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
  advertisingFee: {
    useDates: boolean;
    term: number;
    advertisingCost: string;
    weeksRemaining: string;
    moveOutDate: string | null;
    agreementEndDate: string | null;
    calculatedFee: number | null;
    error: string | null;
    isLoading: boolean;
  };
  relettingFee: {
    useDates: boolean;
    baseWeeklyRent: string;
    term: number;
    weeksRemaining: string;
    moveOutDate: string | null;
    agreementEndDate: string | null;
    calculatedFee: {
      weeklyRentWithGST: number;
      maximumRelettingFee: number;
    } | null;
    error: string | null;
    isLoading: boolean;
  };
}

const migrations = {
  0: (state: CalculatorState & { _persist?: { version: number; rehydrated: boolean } }) => {
    // Migration from version 0 to 1
    const currentPersist = state?._persist ?? { version: 1, rehydrated: true };
    
    return {
      version: 1,
      advertisingFee: {
        useDates: false,
        term: 0,
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
        term: 0,
        weeksRemaining: '',
        moveOutDate: null,
        agreementEndDate: null,
        calculatedFee: null,
        error: null,
        isLoading: false
      },
      _persist: currentPersist
    }
  },
}

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['calculator'], // This should match your reducer name
  migrate: createMigrate(migrations, { debug: process.env.NODE_ENV === 'development' })
}

// Create persisted reducer
const persistedReducer = persistReducer<CalculatorState>(persistConfig, calculatorReducer)

// Create store with initial state
const initialState = {
  calculator: {
    version: 1,
    _persist: { version: 1, rehydrated: false },
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
    }
  }
}

export const store = configureStore({
  reducer: {
    calculator: persistedReducer,
  },
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/PURGE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PAUSE'
        ],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
