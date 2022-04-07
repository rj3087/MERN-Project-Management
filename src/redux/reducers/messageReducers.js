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

export const messageRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_MESSAGE_REQUEST:
      return { isLoading: true };
    case REGISTER_MESSAGE_SUCCESS:
      return { isLoading: false, message: action.payload };
    case REGISTER_MESSAGE_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const messageGetByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_MESSAGE_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_MESSAGE_BY_ID_SUCCESS:
      return { isLoading: false, message: action.payload };
    case GET_MESSAGE_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const messageListGetReducer = (state = { messages: [] }, action) => {
  switch (action.type) {
    case GET_MESSAGES_LIST_REQUEST:
      return { isLoading: true };
    case GET_MESSAGES_LIST_SUCCESS:
      return { isLoading: false, messages: action.payload };
    case GET_MESSAGES_LIST_FAIL:
      return { isLoading: false, messages: action.payload };
    default:
      return state;
  }
};

export const messageUpdateSeenReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_MESSAGES_SEEN_REQUEST:
      return { isLoading: true };
    case UPDATE_MESSAGES_SEEN_SUCCESS:
      return { isLoading: false, message: action.payload };
    case UPDATE_MESSAGES_SEEN_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const messageUploadAttachmentsReducer = (state = {}, action) => {
  switch (action.type) {
    case UPLOAD_MESSAGE_ATTACHMENTS_REQUEST:
      return { isLoading: true };
    case UPLOAD_MESSAGE_ATTACHMENTS_SUCCESS:
      return {
        isLoading: false,
        uploadAttachments: action.payload,
      };
    case UPLOAD_MESSAGE_ATTACHMENTS_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};
