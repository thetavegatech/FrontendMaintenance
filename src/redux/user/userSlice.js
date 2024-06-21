// userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
  },
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload // Store user data when logging in
    },
    logout: (state) => {
      state.currentUser = null // Clear user data when logging out
    },
  },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
