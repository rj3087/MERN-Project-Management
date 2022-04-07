import {
  REGISTER_CONVERSATION_REQUEST,
  REGISTER_CONVERSATION_SUCCESS,
  REGISTER_CONVERSATION_FAIL,
  GET_CONVERSATION_BY_ID_REQUEST,
  GET_CONVERSATION_BY_ID_SUCCESS,
  GET_CONVERSATION_BY_ID_FAIL,
} from '../../constants/conversationConstants';

export const conversationRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_CONVERSATION_REQUEST:
      return { isLoading: true };
    case REGISTER_CONVERSATION_SUCCESS:
      return { isLoading: false, conversation: action.payload };
    case REGISTER_CONVERSATION_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const conversationGetByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CONVERSATION_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_CONVERSATION_BY_ID_SUCCESS:
      return { isLoading: false, conversation: action.payload };
    case GET_CONVERSATION_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};
