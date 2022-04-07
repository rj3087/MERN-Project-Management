import axios from 'axios';

import {
  REGISTER_DEPARTMENT_REQUEST,
  REGISTER_DEPARTMENT_SUCCESS,
  REGISTER_DEPARTMENT_FAIL,
  GET_DEPARTMENT_BY_ID_REQUEST,
  GET_DEPARTMENT_BY_ID_SUCCESS,
  GET_DEPARTMENT_BY_ID_FAIL,
  GET_DEPARTMENT_LIST_REQUEST,
  GET_DEPARTMENT_LIST_SUCCESS,
  GET_DEPARTMENT_LIST_FAIL,
  REGISTER_CLIENT_REQUEST,
  REGISTER_CLIENT_SUCCESS,
  REGISTER_CLIENT_FAIL,
  GET_CLIENT_LIST_REQUEST,
  GET_CLIENT_LIST_SUCCESS,
  GET_CLIENT_LIST_FAIL,
  GET_CLIENT_BY_ID_REQUEST,
  GET_CLIENT_BY_ID_SUCCESS,
  GET_CLIENT_BY_ID_FAIL,
  REGISTER_TEAM_REQUEST,
  REGISTER_TEAM_SUCCESS,
  REGISTER_TEAM_FAIL,
  GET_TEAM_BY_ID_REQUEST,
  GET_TEAM_BY_ID_SUCCESS,
  GET_TEAM_BY_ID_FAIL,
  GET_TEAM_LIST_REQUEST,
  GET_TEAM_LIST_SUCCESS,
  GET_TEAM_LIST_FAIL,
} from '../../constants/utilitiesContants';

export const registerDepartment = (departmentInfo) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_DEPARTMENT_REQUEST,
    });

    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/department/register`,
      data: departmentInfo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: REGISTER_DEPARTMENT_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: REGISTER_DEPARTMENT_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getDepartmentById = (departmentId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_DEPARTMENT_BY_ID_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/department/${departmentId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_DEPARTMENT_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_DEPARTMENT_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getDepartmentList = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_DEPARTMENT_LIST_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/department/list`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_DEPARTMENT_LIST_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_DEPARTMENT_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const registerClient = (clientInfo) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_CLIENT_REQUEST,
    });

    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/client/register`,
      data: clientInfo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: REGISTER_CLIENT_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: REGISTER_CLIENT_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getClientList = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_CLIENT_LIST_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/client/list`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_CLIENT_LIST_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_CLIENT_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getClientById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: GET_CLIENT_BY_ID_REQUEST,
    });

    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/client/get/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_CLIENT_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_CLIENT_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const registerTeam = (teamInfo) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_TEAM_REQUEST,
    });

    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/team/register`,
      data: teamInfo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: REGISTER_TEAM_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: REGISTER_TEAM_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getTeamById = (teamId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_TEAM_BY_ID_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/team/view/${teamId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_TEAM_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_TEAM_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getTeams = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_TEAM_LIST_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/team/list`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: GET_TEAM_LIST_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_TEAM_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
