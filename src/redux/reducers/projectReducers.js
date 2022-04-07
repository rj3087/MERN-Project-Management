import {
  REGISTER_PROJECT_REQUEST,
  REGISTER_PROJECT_SUCCESS,
  REGISTER_PROJECT_FAIL,
  GET_PROJECT_BY_ID_REQUEST,
  GET_PROJECT_BY_ID_SUCCESS,
  GET_PROJECT_BY_ID_FAIL,
  GET_PROJECT_TASK_LIST_BY_ID_REQUEST,
  GET_PROJECT_TASK_LIST_BY_ID_SUCCESS,
  GET_PROJECT_TASK_LIST_BY_ID_FAIL,
  GET_PROJECT_LIST_REQUEST,
  GET_PROJECT_LIST_SUCCESS,
  GET_PROJECT_LIST_FAIL,
  DELETE_PROJECT_BY_ID_REQUEST,
  DELETE_PROJECT_BY_ID_SUCCESS,
  DELETE_PROJECT_BY_ID_FAIL,
  UPDATE_PROJECT_BY_ID_REQUEST,
  UPDATE_PROJECT_BY_ID_SUCCESS,
  UPDATE_PROJECT_BY_ID_FAIL,
} from '../../constants/projectConstants';

export const projectRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_PROJECT_REQUEST:
      return { isLoading: true };
    case REGISTER_PROJECT_SUCCESS:
      return { isLoading: false, project: action.payload };
    case REGISTER_PROJECT_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const projectGetByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_PROJECT_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_PROJECT_BY_ID_SUCCESS:
      return { isLoading: false, project: action.payload };
    case GET_PROJECT_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const projectGetListTaskByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_PROJECT_TASK_LIST_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_PROJECT_TASK_LIST_BY_ID_SUCCESS:
      return { isLoading: false, projectTaskList: action.payload };
    case GET_PROJECT_TASK_LIST_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const projectListGetReducer = (state = { projects: [] }, action) => {
  switch (action.type) {
    case GET_PROJECT_LIST_REQUEST:
      return { isLoading: true };
    case GET_PROJECT_LIST_SUCCESS:
      return { isLoading: false, projects: action.payload };
    case GET_PROJECT_LIST_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const projectDeletedByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PROJECT_BY_ID_REQUEST:
      return { isLoading: true };
    case DELETE_PROJECT_BY_ID_SUCCESS:
      return { isLoading: false, deletedProjectById: action.payload };
    case DELETE_PROJECT_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const projectUpdateByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PROJECT_BY_ID_REQUEST:
      return { isLoading: true };
    case UPDATE_PROJECT_BY_ID_SUCCESS:
      return { isLoading: false, updatedProject: action.payload };
    case UPDATE_PROJECT_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};
