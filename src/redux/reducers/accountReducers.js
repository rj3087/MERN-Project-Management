import {
  ACCOUNT_REGISTER_REQUEST,
  ACCOUNT_REGISTER_SUCCESS,
  ACCOUNT_REGISTER_FAIL,
  ACCOUNT_ACTIVATION_REQUEST,
  ACCOUNT_ACTIVATION_SUCCESS,
  ACCOUNT_ACTIVATION_FAIL,
  ACCOUNT_LOGIN_REQUEST,
  ACCOUNT_LOGIN_SUCCESS,
  ACCOUNT_LOGIN_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  GET_ACCOUNT_REQUEST,
  GET_ACCOUNT_SUCCESS,
  GET_ACCOUNT_FAIL,
  GET_ACCOUNT_BY_ID_REQUEST,
  GET_ACCOUNT_BY_ID_SUCCESS,
  GET_ACCOUNT_BY_ID_FAIL,
  GET_ACCOUNT_BY_NAME_REQUEST,
  GET_ACCOUNT_BY_NAME_SUCCESS,
  GET_ACCOUNT_BY_NAME_FAIL,
  GET_ACCOUNTS_REQUEST,
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNTS_FAIL,
  UPDATE_ACCOUNT_REQUEST,
  UPDATE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_FAIL,
  UPDATE_ACCOUNT_PASSWORD_REQUEST,
  UPDATE_ACCOUNT_PASSWORD_SUCCESS,
  UPDATE_ACCOUNT_PASSWORD_FAIL,
  UPLOAD_ACCOUNT_PROFILE_REQUEST,
  UPLOAD_ACCOUNT_PROFILE_SUCCESS,
  UPLOAD_ACCOUNT_PROFILE_FAIL,
} from '../../constants/accountConstants';

export const accountRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case ACCOUNT_REGISTER_REQUEST:
      return { isLoading: true };
    case ACCOUNT_REGISTER_SUCCESS:
      return { isLoading: false, account: action.payload };
    case ACCOUNT_REGISTER_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const accountActivationReducer = (state = {}, action) => {
  switch (action.type) {
    case ACCOUNT_ACTIVATION_REQUEST:
      return { isLoading: true };
    case ACCOUNT_ACTIVATION_SUCCESS:
      return { isLoading: false, account: action.payload };
    case ACCOUNT_ACTIVATION_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const accountLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case ACCOUNT_LOGIN_REQUEST:
      return { isLoading: true };
    case ACCOUNT_LOGIN_SUCCESS:
      return { isLoading: false, currentAccountInfo: action.payload };
    case ACCOUNT_LOGIN_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const forgotPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD_REQUEST:
      return { isLoading: true };
    case FORGOT_PASSWORD_SUCCESS:
      return { isLoading: false, email: action.payload };
    case FORGOT_PASSWORD_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const resetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case RESET_PASSWORD_REQUEST:
      return { isLoading: true };
    case RESET_PASSWORD_SUCCESS:
      return { isLoading: false, password: action.payload };
    case RESET_PASSWORD_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const accountGetReducer = (state = { account: {} }, action) => {
  switch (action.type) {
    case GET_ACCOUNT_REQUEST:
      return { isLoading: true };
    case GET_ACCOUNT_SUCCESS:
      return { isLoading: false, account: action.payload };
    case GET_ACCOUNT_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const accountGetByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ACCOUNT_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_ACCOUNT_BY_ID_SUCCESS:
      return { isLoading: false, accountById: action.payload };
    case GET_ACCOUNT_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const accountGetByNameReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ACCOUNT_BY_NAME_REQUEST:
      return { isLoading: true };
    case GET_ACCOUNT_BY_NAME_SUCCESS:
      return { isLoading: false, accountByName: action.payload };
    case GET_ACCOUNT_BY_NAME_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const accountsGetReducer = (state = { accounts: [] }, action) => {
  switch (action.type) {
    case GET_ACCOUNTS_REQUEST:
      return { isLoading: true };
    case GET_ACCOUNTS_SUCCESS:
      return { isLoading: false, accounts: action.payload };
    case GET_ACCOUNTS_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const accountUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT_REQUEST:
      return { isLoading: true };
    case UPDATE_ACCOUNT_SUCCESS:
      return {
        isLoading: false,
        success: true,
        updatedAccount: action.payload,
      };
    case UPDATE_ACCOUNT_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const accountPasswordUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT_PASSWORD_REQUEST:
      return { isLoading: true };
    case UPDATE_ACCOUNT_PASSWORD_SUCCESS:
      return {
        isLoading: false,
        success: true,
        updatedPassword: action.payload,
      };
    case UPDATE_ACCOUNT_PASSWORD_FAIL:
      return { isLoading: false, errorPassword: action.payload };
    default:
      return state;
  }
};

export const accountUploadProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case UPLOAD_ACCOUNT_PROFILE_REQUEST:
      return { isLoading: true };
    case UPLOAD_ACCOUNT_PROFILE_SUCCESS:
      return {
        isLoading: false,
        profileAccount: action.payload,
      };
    case UPLOAD_ACCOUNT_PROFILE_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};
