// Import your action types
import {
  FETCH_ASSETS_REQUEST,
  FETCH_ASSETS_SUCCESS,
  FETCH_ASSETS_FAILURE,
  DELETE_ASSET_REQUEST,
  DELETE_ASSET_SUCCESS,
  DELETE_ASSET_FAILURE,
} from '../../views/assetTable/actions/assets'

// Initial state for the assets reducer
const initialState = {
  assets: [],
  loading: false,
  error: null,
}

// Reducer function for assets
const assetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ASSETS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_ASSETS_SUCCESS:
      return {
        ...state,
        loading: false,
        assets: action.payload,
        error: null,
      }
    case FETCH_ASSETS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case DELETE_ASSET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case DELETE_ASSET_SUCCESS:
      return {
        ...state,
        loading: false,
        assets: state.assets.filter((asset) => asset._id !== action.payload),
        error: null,
      }
    case DELETE_ASSET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default assetsReducer
