import { configureStore } from '@reduxjs/toolkit'
import { formApi } from './api/formApi'
import formReducer from './slices/formSlice'

export const store = configureStore({
  reducer: {
    form: formReducer,
    [formApi.reducerPath]: formApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(formApi.middleware),
})
