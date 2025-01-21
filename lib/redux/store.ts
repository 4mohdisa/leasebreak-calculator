import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import calculatorReducer from './calculatorSlice'
import storage from './customStorage'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['calculator'] // only calculator will be persisted
}

const persistedReducer = persistReducer(persistConfig, calculatorReducer)

export const store = configureStore({
  reducer: {
    calculator: persistedReducer,
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
