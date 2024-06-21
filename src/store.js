import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { apiSlice } from './slices/apiSlice'
import changeState from './slices/reducers'

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    custom: changeState,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
})

export default store

// import { configureStore, createSlice } from '@reduxjs/toolkit'

// // Create a slice for authReducer
// export const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     userInfo: null,
//   },
//   reducers: {
//     setCredentials: (state, action) => {
//       state.userInfo = action.payload
//     },
//     logout: (state) => {
//       state.userInfo = null
//     },
//   },
// })

// // Create a slice for custom reducer
// export const changeStateSlice = createSlice({
//   name: 'changeState',
//   initialState: {
//     sidebarShow: true,
//   },
//   reducers: {
//     set: (state, action) => {
//       return { ...state, ...action.payload }
//     },
//   },
// })

// // Export actions from slices
// export const { setCredentials, logout } = authSlice.actions
// export const { set } = changeStateSlice.actions

// // Combine the reducers
// const rootReducer = {
//   auth: authSlice.reducer,
//   changeState: changeStateSlice.reducer,
// }

// // Create Redux store with @reduxjs/toolkit
// const store = configureStore({
//   reducer: rootReducer,
//   devTools: true,
// })

// export default store
