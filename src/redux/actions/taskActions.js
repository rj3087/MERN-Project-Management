import axios from 'axios';

import {
  REGISTER_TASK_REQUEST,
  REGISTER_TASK_SUCCESS,
  REGISTER_TASK_FAIL,
  GET_TASK_BY_ID_REQUEST,
  GET_TASK_BY_ID_SUCCESS,
  GET_TASK_BY_ID_FAIL,
  GET_TASK_BY_NAME_REQUEST,
  GET_TASK_BY_NAME_SUCCESS,
  GET_TASK_BY_NAME_FAIL,
  GET_TASK_LIST_REQUEST,
  GET_TASK_LIST_SUCCESS,
  GET_TASK_LIST_FAIL,
  DELETE_TASK_BY_ID_REQUEST,
  DELETE_TASK_BY_ID_SUCCESS,
  DELETE_TASK_BY_ID_FAIL,
  UPDATE_TASK_BY_ID_REQUEST,
  UPDATE_TASK_BY_ID_SUCCESS,
  UPDATE_TASK_BY_ID_FAIL,
  UPDATE_TASK_STATUS_BY_ID_REQUEST,
  UPDATE_TASK_STATUS_BY_ID_SUCCESS,
  UPDATE_TASK_STATUS_BY_ID_FAIL,
  UPLOAD_TASK_ATTACHMENTS_REQUEST,
  UPLOAD_TASK_ATTACHMENTS_SUCCESS,
  UPLOAD_TASK_ATTACHMENTS_FAIL,
  DELETE_TASK_ATTACHMENT_REQUEST,
  DELETE_TASK_ATTACHMENT_SUCCESS,
  DELETE_TASK_ATTACHMENT_FAIL,
  DELETE_TASK_ATTACHMENT_FILE_REQUEST,
  DELETE_TASK_ATTACHMENT_FILE_SUCCESS,
  DELETE_TASK_ATTACHMENT_FILE_FAIL,
} from '../../constants/taskConstants';

export const registerTask = (taskInfo) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_TASK_REQUEST,
    });

    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/task/register`,
      data: taskInfo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: REGISTER_TASK_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: REGISTER_TASK_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getTaskById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: GET_TASK_BY_ID_REQUEST,
    });
    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/task/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_TASK_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_TASK_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getTaskByName = (taskLink) => async (dispatch) => {
  try {
    dispatch({
      type: GET_TASK_BY_NAME_REQUEST,
    });
    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/task/browse/${taskLink}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_TASK_BY_NAME_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_TASK_BY_NAME_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const deleteTaskById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_TASK_BY_ID_REQUEST,
    });
    await axios({
      method: 'DELETE',
      url: `http://localhost:5000/api/task/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: DELETE_TASK_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: DELETE_TASK_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const updateTaskById =
  (taskInfo, updatedDescription) => async (dispatch) => {
    const task = {
      taskInfo: taskInfo,
      updatedDescription: updatedDescription,
    };

    try {
      dispatch({
        type: UPDATE_TASK_BY_ID_REQUEST,
      });
      await axios({
        method: 'PUT',
        url: `http://localhost:5000/api/task/update/${task.taskInfo._id}`,
        data: task,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem('tokenId')
          )}`,
        },
      }).then((res) => {
        dispatch({
          type: UPDATE_TASK_BY_ID_SUCCESS,
          payload: res.data,
        });
      });
    } catch (error) {
      dispatch({
        type: UPDATE_TASK_BY_ID_FAIL,
        payload:
          error.response && error.response.data
            ? error.response.data
            : error.message,
      });
    }
  };

export const updateTaskStatusById = (status) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_TASK_STATUS_BY_ID_REQUEST,
    });
    await axios({
      method: 'PUT',
      url: `http://localhost:5000/api/task/${status.id}`,
      data: status,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: UPDATE_TASK_STATUS_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TASK_STATUS_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getTaskList = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_TASK_LIST_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/task`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_TASK_LIST_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_TASK_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const uploadTaskAttachments = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: UPLOAD_TASK_ATTACHMENTS_REQUEST,
    });

    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/task/upload',
      data: formData,
      headers: {
        'Content-type': 'application/json',
      },
    }).then((res) => {
      dispatch({
        type: UPLOAD_TASK_ATTACHMENTS_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: UPLOAD_TASK_ATTACHMENTS_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const deleteTaskAttachment = (path, name) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_TASK_ATTACHMENT_REQUEST,
    });

    await axios({
      method: 'DELETE',
      url: `http://localhost:5000/api/task/delete/${path}/${name}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: DELETE_TASK_ATTACHMENT_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: DELETE_TASK_ATTACHMENT_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const deleteTaskAttachmentFile = (id, name) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_TASK_ATTACHMENT_FILE_REQUEST,
    });

    await axios({
      method: 'PUT',
      url: `http://localhost:5000/api/task/${id}/${name}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: DELETE_TASK_ATTACHMENT_FILE_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: DELETE_TASK_ATTACHMENT_FILE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
