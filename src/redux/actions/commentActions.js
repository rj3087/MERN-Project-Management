import axios from 'axios';

import {
  REGISTER_TASK_COMMENT_REQUEST,
  REGISTER_TASK_COMMENT_SUCCESS,
  REGISTER_TASK_COMMENT_FAIL,
  GET_TASK_COMMENT_BY_ID_REQUEST,
  GET_TASK_COMMENT_BY_ID_SUCCESS,
  GET_TASK_COMMENT_BY_ID_FAIL,
} from '../../constants/commentContants';

export const registerTaskComment = (commentInfo) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_TASK_COMMENT_REQUEST,
    });
    await axios({
      method: 'post',
      url: `http://localhost:5000/api/comment/post`,
      data: commentInfo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: REGISTER_TASK_COMMENT_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: REGISTER_TASK_COMMENT_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getTaskCommentById = (taskId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_TASK_COMMENT_BY_ID_REQUEST,
    });
    await axios({
      method: 'get',
      url: `http://localhost:5000/api/comment/${taskId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_TASK_COMMENT_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: GET_TASK_COMMENT_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
