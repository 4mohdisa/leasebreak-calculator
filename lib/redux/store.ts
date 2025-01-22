import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import calculatorReducer from './calculatorSlice';
import storage from './customStorage';

// Define interfaces for state
interface CalculatedFee {
  weeklyRentWithGST: number;
  maximumRelettingFee: number;
}

interface BaseState {
  useDates: boolean;
  term: number;
  weeksRemaining: string;
  moveOutDate: string | null;
  agreementEndDate: string | null;
  error: string | null;
  isLoading: boolean;
}

interface AdvertisingFeeState extends BaseState {
  advertisingCost: string;
  calculatedFee: number | null;
}

interface RelettingFeeState extends BaseState {
  baseWeeklyRent: string;
  calculatedFee: CalculatedFee | null;
}

interface CalculatorState {
  advertisingFee: AdvertisingFeeState;
  relettingFee: RelettingFeeState;
}

interface RootState {
  calculator: CalculatorState;
}

// Define initial state
const initialState: RootState = {
  calculator: {
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

// Define migrations
const migrations = {
  0: (state: any) => {
    return {
      ...initialState,
      _persist: state?._persist || { version: 1, rehydrated: true }
    };
  },
};

// Configure persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['calculator'],
  migrate: createMigrate(migrations, { debug: process.env.NODE_ENV === 'development' })
}

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, calculatorReducer);

// Create store
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
          'persist/PAUSE'
        ],
      },
    }),
})

export const persistor = persistStore(store)

// Export types
export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch