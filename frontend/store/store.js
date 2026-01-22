import { configureStore } from '@reduxjs/toolkit'
import { formApi } from './api/formApi'
import formSlice from './slices/formSlice'

export const store = configureStore({
  reducer: {
    form: formSlice,
    [formApi.reducerPath]: formApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(formApi.middleware),
})


