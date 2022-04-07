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

export const departmentRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_DEPARTMENT_REQUEST:
      return { isLoading: true };
    case REGISTER_DEPARTMENT_SUCCESS:
      return { isLoading: false, department: action.payload };
    case REGISTER_DEPARTMENT_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const departmentGetByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_DEPARTMENT_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_DEPARTMENT_BY_ID_SUCCESS:
      return { isLoading: false, departmentById: action.payload };
    case GET_DEPARTMENT_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const departmentListGetReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_DEPARTMENT_LIST_REQUEST:
      return { isLoading: true };
    case GET_DEPARTMENT_LIST_SUCCESS:
      return { isLoading: false, departments: action.payload };
    case GET_DEPARTMENT_LIST_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const clientRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_CLIENT_REQUEST:
      return { isLoading: true };
    case REGISTER_CLIENT_SUCCESS:
      return { isLoading: false, client: action.payload };
    case REGISTER_CLIENT_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const clientGetByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CLIENT_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_CLIENT_BY_ID_SUCCESS:
      return { isLoading: false, clientById: action.payload };
    case GET_CLIENT_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const clientListGetReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CLIENT_LIST_REQUEST:
      return { isLoading: true };
    case GET_CLIENT_LIST_SUCCESS:
      return { isLoading: false, client: action.payload };
    case GET_CLIENT_LIST_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const teamRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_TEAM_REQUEST:
      return { isLoading: true };
    case REGISTER_TEAM_SUCCESS:
      return { isLoading: false, team: action.payload };
    case REGISTER_TEAM_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const teamListGetReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_TEAM_LIST_REQUEST:
      return { isLoading: true };
    case GET_TEAM_LIST_SUCCESS:
      return { isLoading: false, teams: action.payload };
    case GET_TEAM_LIST_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const teamByIdGetReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_TEAM_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_TEAM_BY_ID_SUCCESS:
      return { isLoading: false, teamById: action.payload };
    case GET_TEAM_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};
