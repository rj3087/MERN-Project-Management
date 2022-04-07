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
  DELETE_TASK_BY_ID_REQUEST,
  DELETE_TASK_BY_ID_SUCCESS,
  DELETE_TASK_BY_ID_FAIL,
  UPDATE_TASK_BY_ID_REQUEST,
  UPDATE_TASK_BY_ID_SUCCESS,
  UPDATE_TASK_BY_ID_FAIL,
  UPDATE_TASK_STATUS_BY_ID_REQUEST,
  UPDATE_TASK_STATUS_BY_ID_SUCCESS,
  UPDATE_TASK_STATUS_BY_ID_FAIL,
  GET_TASK_LIST_REQUEST,
  GET_TASK_LIST_SUCCESS,
  GET_TASK_LIST_FAIL,
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

export const taskRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_TASK_REQUEST:
      return { isLoading: true };
    case REGISTER_TASK_SUCCESS:
      return { isLoading: false, taskCreated: action.payload };
    case REGISTER_TASK_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const taskGetByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_TASK_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_TASK_BY_ID_SUCCESS:
      return { isLoading: false, taskByid: action.payload };
    case GET_TASK_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const taskGetByNameReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_TASK_BY_NAME_REQUEST:
      return { isLoading: true };
    case GET_TASK_BY_NAME_SUCCESS:
      return { isLoading: false, task: action.payload };
    case GET_TASK_BY_NAME_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const taskUpdateByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_TASK_BY_ID_REQUEST:
      return { isLoading: true };
    case UPDATE_TASK_BY_ID_SUCCESS:
      return { isLoading: false, updatedTask: action.payload };
    case UPDATE_TASK_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const taskDeleteByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_TASK_BY_ID_REQUEST:
      return { isLoading: true };
    case DELETE_TASK_BY_ID_SUCCESS:
      return { isLoading: false, taskDeleted: action.payload };
    case DELETE_TASK_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const taskListGetReducer = (state = { tasks: [] }, action) => {
  switch (action.type) {
    case GET_TASK_LIST_REQUEST:
      return { isLoading: true };
    case GET_TASK_LIST_SUCCESS:
      return { isLoading: false, tasks: action.payload };
    case GET_TASK_LIST_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const taskUploadAttachmentsReducer = (
  state = { uploadAttachments: [] },
  action
) => {
  switch (action.type) {
    case UPLOAD_TASK_ATTACHMENTS_REQUEST:
      return { isLoading: true };
    case UPLOAD_TASK_ATTACHMENTS_SUCCESS:
      return {
        isLoading: false,
        uploadAttachments: action.payload,
      };
    case UPLOAD_TASK_ATTACHMENTS_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const taskDeleteAttachmentReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_TASK_ATTACHMENT_REQUEST:
      return { isLoading: true };
    case DELETE_TASK_ATTACHMENT_SUCCESS:
      return {
        isLoading: false,
        deletedAttachments: action.payload,
      };
    case DELETE_TASK_ATTACHMENT_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const taskDeleteAttachmentFileReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_TASK_ATTACHMENT_FILE_REQUEST:
      return { isLoading: true };
    case DELETE_TASK_ATTACHMENT_FILE_SUCCESS:
      return {
        isLoading: false,
        updatedAttachment: action.payload,
      };
    case DELETE_TASK_ATTACHMENT_FILE_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};
