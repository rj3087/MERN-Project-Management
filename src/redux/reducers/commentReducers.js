import {
  REGISTER_TASK_COMMENT_REQUEST,
  REGISTER_TASK_COMMENT_SUCCESS,
  REGISTER_TASK_COMMENT_FAIL,
  GET_TASK_COMMENT_BY_ID_REQUEST,
  GET_TASK_COMMENT_BY_ID_SUCCESS,
  GET_TASK_COMMENT_BY_ID_FAIL,
} from '../../constants/commentContants';

export const registerTaskCommentReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_TASK_COMMENT_REQUEST:
      return { isLoading: true };
    case REGISTER_TASK_COMMENT_SUCCESS:
      return { isLoading: false, taskComment: action.payload };
    case REGISTER_TASK_COMMENT_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const getTaskCommentReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_TASK_COMMENT_BY_ID_REQUEST:
      return { isLoading: true };
    case GET_TASK_COMMENT_BY_ID_SUCCESS:
      return { isLoading: false, commentListById: action.payload };
    case GET_TASK_COMMENT_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};
