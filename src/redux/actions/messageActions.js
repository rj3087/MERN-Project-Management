import axios from 'axios';

import {
  REGISTER_MESSAGE_REQUEST,
  REGISTER_MESSAGE_SUCCESS,
  REGISTER_MESSAGE_FAIL,
  GET_MESSAGE_BY_ID_REQUEST,
  GET_MESSAGE_BY_ID_SUCCESS,
  GET_MESSAGE_BY_ID_FAIL,
  GET_MESSAGES_LIST_REQUEST,
  GET_MESSAGES_LIST_SUCCESS,
  GET_MESSAGES_LIST_FAIL,
  UPDATE_MESSAGES_SEEN_REQUEST,
  UPDATE_MESSAGES_SEEN_SUCCESS,
  UPDATE_MESSAGES_SEEN_FAIL,
  UPLOAD_MESSAGE_ATTACHMENTS_REQUEST,
  UPLOAD_MESSAGE_ATTACHMENTS_SUCCESS,
  UPLOAD_MESSAGE_ATTACHMENTS_FAIL,
} from '../../constants/messageConstants';

export const registerMessage = (message) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_MESSAGE_REQUEST,
    });

    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/message`,
      data: message,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: REGISTER_MESSAGE_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: REGISTER_MESSAGE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getMessageById = (messageId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_MESSAGE_BY_ID_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/message/${messageId}`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_MESSAGE_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_MESSAGE_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getMessageList = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_MESSAGES_LIST_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/message/`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_MESSAGES_LIST_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_MESSAGES_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const updateTaskSeen = (updateSeen) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_MESSAGES_SEEN_REQUEST,
    });
    await axios({
      method: 'PUT',
      url: `http://localhost:5000/api/message/seen`,
      data: updateSeen,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: UPDATE_MESSAGES_SEEN_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: UPDATE_MESSAGES_SEEN_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const uploadMessageAttachments = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: UPLOAD_MESSAGE_ATTACHMENTS_REQUEST,
    });

    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/message/upload',
      data: formData,
      headers: {
        'Content-type': 'application/json',
      },
    }).then((res) => {
      dispatch({
        type: UPLOAD_MESSAGE_ATTACHMENTS_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: UPLOAD_MESSAGE_ATTACHMENTS_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
