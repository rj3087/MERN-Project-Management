import axios from 'axios';

import {
  REGISTER_PROJECT_REQUEST,
  REGISTER_PROJECT_SUCCESS,
  REGISTER_PROJECT_FAIL,
  GET_PROJECT_LIST_REQUEST,
  GET_PROJECT_LIST_SUCCESS,
  GET_PROJECT_LIST_FAIL,
  GET_PROJECT_BY_ID_REQUEST,
  GET_PROJECT_BY_ID_SUCCESS,
  GET_PROJECT_BY_ID_FAIL,
  GET_PROJECT_TASK_LIST_BY_ID_REQUEST,
  GET_PROJECT_TASK_LIST_BY_ID_SUCCESS,
  GET_PROJECT_TASK_LIST_BY_ID_FAIL,
  DELETE_PROJECT_BY_ID_REQUEST,
  DELETE_PROJECT_BY_ID_SUCCESS,
  DELETE_PROJECT_BY_ID_FAIL,
  UPDATE_PROJECT_BY_ID_REQUEST,
  UPDATE_PROJECT_BY_ID_SUCCESS,
  UPDATE_PROJECT_BY_ID_FAIL,
} from '../../constants/projectConstants';

export const registerProject = (projectInfo) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_PROJECT_REQUEST,
    });

    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/project/register`,
      data: projectInfo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: REGISTER_PROJECT_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: REGISTER_PROJECT_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getProjectList = (accountId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_PROJECT_LIST_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/project`,
      data: accountId,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_PROJECT_LIST_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_PROJECT_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getProjectById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: GET_PROJECT_BY_ID_REQUEST,
    });
    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/project/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_PROJECT_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_PROJECT_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getProjTaskListById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: GET_PROJECT_TASK_LIST_BY_ID_REQUEST,
    });
    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/project/board/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_PROJECT_TASK_LIST_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_PROJECT_TASK_LIST_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const deleteProjectById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_PROJECT_BY_ID_REQUEST,
    });

    await axios({
      method: 'DELETE',
      url: `http://localhost:5000/api/project/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: DELETE_PROJECT_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: DELETE_PROJECT_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const updateProjectById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_PROJECT_BY_ID_REQUEST,
    });

    await axios({
      method: 'PUT',
      url: `http://localhost:5000/api/project/${id._id}`,
      data: id,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: UPDATE_PROJECT_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PROJECT_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
