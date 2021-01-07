import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PAGE_CHANGED,
  USER_UPDATE,
  UPDATE_FAIL,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: true,
  user: null,
  page: "home",
  valid: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        valid: (!action.payload.bio || !action.payload.gender || action.payload.pictures.length === 0 || action.payload.interests.length < 3 || !action.payload.sexualPref || action.payload.resetToken) ? false : true
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        valid: (!action.payload.user.bio || !action.payload.user.gender || action.payload.user.pictures.length === 0 || action.payload.user.interests.length < 3 || !action.payload.user.sexualPref || action.payload.user.resetToken) ? false : true
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case PAGE_CHANGED:
      return {
        ...state,
        page: action.payload,
      };
    case UPDATE_FAIL:
      return {
        ...state,
      };
    case USER_UPDATE:
      return {
        ...state,
        user: action.payload,
        valid: (!action.payload.bio || !action.payload.gender || action.payload.pictures.length === 0 || action.payload.interests.length < 3 || !action.payload.sexualPref || action.payload.resetToken) ? false : true
      };
    default:
      return state;
  }
}
