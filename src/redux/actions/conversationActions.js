import axios from 'axios';

import {
  REGISTER_CONVERSATION_REQUEST,
  REGISTER_CONVERSATION_SUCCESS,
  REGISTER_CONVERSATION_FAIL,
  GET_CONVERSATION_BY_ID_REQUEST,
  GET_CONVERSATION_BY_ID_SUCCESS,
  GET_CONVERSATION_BY_ID_FAIL,
} from '../../constants/conversationConstants';

export const registerConversation = (conversationInfo) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_CONVERSATION_REQUEST,
    });

    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/conversation/register`,
      data: conversationInfo,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: REGISTER_CONVERSATION_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: REGISTER_CONVERSATION_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getConversationById = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_CONVERSATION_BY_ID_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/conversation/${userId}`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_CONVERSATION_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_CONVERSATION_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
