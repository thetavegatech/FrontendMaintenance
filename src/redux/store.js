import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import assetsReducer from './reducers/assets'

// Combine reducers if you have multiple reducers
const rootReducer = combineReducers({
  assets: assetsReducer,
  // Add other reducers here if needed
})

// Create Redux store with combined reducers and apply middleware
const store = createStore(rootReducer, applyMiddleware(thunk))

export default store
