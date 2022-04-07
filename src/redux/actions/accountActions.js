import axios from 'axios';

import {
  ACCOUNT_REGISTER_REQUEST,
  ACCOUNT_REGISTER_SUCCESS,
  ACCOUNT_REGISTER_FAIL,
  ACCOUNT_ACTIVATION_REQUEST,
  ACCOUNT_ACTIVATION_SUCCESS,
  ACCOUNT_ACTIVATION_FAIL,
  ACCOUNT_RESEND_ACTIVATION_REQUEST,
  ACCOUNT_RESEND_ACTIVATION_SUCCESS,
  ACCOUNT_RESEND_ACTIVATION_FAIL,
  ACCOUNT_LOGIN_REQUEST,
  ACCOUNT_LOGIN_SUCCESS,
  ACCOUNT_LOGIN_FAIL,
  ACCOUNT_LOGOUT_SUCCESS,
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

export const registerAccount = (accountInfo) => async (dispatch) => {
  try {
    dispatch({
      type: ACCOUNT_REGISTER_REQUEST,
    });

    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/user/register',
      data: accountInfo,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      dispatch({
        type: ACCOUNT_REGISTER_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: ACCOUNT_REGISTER_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const activateAccount = (activationToken) => async (dispatch) => {
  try {
    dispatch({
      type: ACCOUNT_ACTIVATION_REQUEST,
    });

    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/user/activation-account/${activationToken}`,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      dispatch({
        type: ACCOUNT_ACTIVATION_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: ACCOUNT_ACTIVATION_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const reActivationAccount = (email) => async (dispatch) => {
  try {
    dispatch({
      type: ACCOUNT_RESEND_ACTIVATION_REQUEST,
    });

    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/user/reactivation',
      data: email,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      dispatch({
        type: ACCOUNT_RESEND_ACTIVATION_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: ACCOUNT_RESEND_ACTIVATION_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const loginAccount = (accountInfo) => async (dispatch) => {
  try {
    dispatch({
      type: ACCOUNT_LOGIN_REQUEST,
    });
    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/user/login',
      data: accountInfo,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      dispatch({
        type: ACCOUNT_LOGIN_SUCCESS,
        payload: res.data,
      });

      // if (accountInfo.persistLogin) {
      //   localStorage.setItem(
      //     'loginAccount',
      //     JSON.stringify({
      //       _id: res.data._id,
      //       isAdmin: res.data.isAdmin,
      //       email: res.data.email,
      //       firstName: res.data.firstName,
      //       lastName: res.data.lastName,
      //       jobTitle: res.data.jobTitle,
      //       department: res.data.department,
      //       accountProfileUploaded: res.data.accountProfileUploaded,
      //     })
      //   );
      //   localStorage.setItem('tokenId', JSON.stringify(res.data.tokenId));
      //   localStorage.setItem(
      //     'accountCurrentTeamList',
      //     JSON.stringify({ currentTeam: res.data.currentTeam })
      //   );
      // }
      localStorage.setItem(
        'loginAccount',
        JSON.stringify({
          _id: res.data._id,
          isAdmin: res.data.isAdmin,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          jobTitle: res.data.jobTitle,
          department: res.data.department,
          accountProfileUploaded: res.data.accountProfileUploaded,
        })
      );
      localStorage.setItem('tokenId', JSON.stringify(res.data.tokenId));
      localStorage.setItem(
        'accountCurrentTeamList',
        JSON.stringify({ currentTeam: res.data.currentTeam })
      );
    });
  } catch (error) {
    dispatch({
      type: ACCOUNT_LOGIN_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const logoutAccount = () => async (dispatch) => {
  dispatch({
    type: ACCOUNT_LOGOUT_SUCCESS,
  });
  localStorage.removeItem('loginAccount');
  localStorage.removeItem('accountCurrentTeamList');
  localStorage.removeItem('tokenId');
  window.location.href = 'http://localhost:3000/login';
};

export const forgotPassword = (emailInfo) => async (dispatch) => {
  try {
    dispatch({
      type: FORGOT_PASSWORD_REQUEST,
    });

    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/user/forgot-password',
      data: emailInfo,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      dispatch({
        type: FORGOT_PASSWORD_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const resetPassword = (password) => async (dispatch) => {
  try {
    dispatch({
      type: RESET_PASSWORD_REQUEST,
    });

    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/user/reset-password/:resetToken',
      data: password,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      dispatch({
        type: RESET_PASSWORD_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getAccount = (username) => async (dispatch) => {
  try {
    dispatch({
      type: GET_ACCOUNT_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/user/${username}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_ACCOUNT_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_ACCOUNT_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getAccountById = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_ACCOUNT_BY_ID_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/user/${userId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_ACCOUNT_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_ACCOUNT_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getAccountByName = (name) => async (dispatch) => {
  try {
    dispatch({
      type: GET_ACCOUNT_BY_NAME_REQUEST,
    });
    console.log(name);
    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/user/search/${name}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_ACCOUNT_BY_NAME_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_ACCOUNT_BY_NAME_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getAccounts = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_ACCOUNTS_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/user`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_ACCOUNTS_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_ACCOUNTS_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const updateAccount = (accountInfo) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_ACCOUNT_REQUEST,
    });
    console.log(accountInfo);
    await axios({
      method: 'PUT',
      url: `http://localhost:5000/api/user/profile`,
      data: accountInfo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: UPDATE_ACCOUNT_SUCCESS,
        payload: res.data,
      });
      localStorage.setItem(
        'loginAccount',
        JSON.stringify({
          _id: res.data._id,
          role: res.data.role,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          jobTitle: res.data.jobTitle,
          department: res.data.department,
          accountProfileUploaded: res.data.accountProfileUploaded,
        })
      );
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ACCOUNT_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const updateAccountPassword = (password) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_ACCOUNT_PASSWORD_REQUEST,
    });

    await axios({
      method: 'PUT',
      url: `http://localhost:5000/api/user/profile/change-password`,
      data: password,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      console.log(res.data);
      dispatch({
        type: UPDATE_ACCOUNT_PASSWORD_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ACCOUNT_PASSWORD_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const uploadAccountProfile = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: UPLOAD_ACCOUNT_PROFILE_REQUEST,
    });

    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/user/profile/upload',
      data: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    }).then((res) => {
      dispatch({
        type: UPLOAD_ACCOUNT_PROFILE_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: UPLOAD_ACCOUNT_PROFILE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
