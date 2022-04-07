import {
  REGISTER_NOTIFICATION_REQUEST,
  REGISTER_NOTIFICATION_SUCCESS,
  REGISTER_NOTIFICATION_FAIL,
  GET_NOTIFICATION_BY_USER_ID_REQUEST,
  GET_NOTIFICATION_BY_USER_ID_SUCCESS,
  GET_NOTIFICATION_BY_USER_ID_FAIL,
  UPDATE_TASK_NOTIF_STATUS_BY_ID_REQUEST,
  UPDATE_TASK_NOTIF_STATUS_BY_ID_SUCCESS,
  UPDATE_TASK_NOTIF_STATUS_BY_ID_FAIL,
  UPDATE_TASK_NAME_LINK_REQUEST,
  UPDATE_TASK_NAME_LINK_SUCCESS,
  UPDATE_TASK_NAME_LINK_FAIL,
} from '../../constants/notificationConstants';

export const registerTaskAssignedNotifReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_NOTIFICATION_REQUEST:
      return { isLoading: true };
    case REGISTER_NOTIFICATION_SUCCESS:
      return { isLoading: false, assignedNotification: action.payload };
    case REGISTER_NOTIFICATION_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const getTaskNotificationByUserIdReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_NOTIFICATION_BY_USER_ID_REQUEST:
      return { isLoading: true };
    case GET_NOTIFICATION_BY_USER_ID_SUCCESS:
      return { isLoading: false, notificationByUserId: action.payload };
    case GET_NOTIFICATION_BY_USER_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const updateTaskNotifStatusByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_TASK_NOTIF_STATUS_BY_ID_REQUEST:
      return { isLoading: true };
    case UPDATE_TASK_NOTIF_STATUS_BY_ID_SUCCESS:
      return { isLoading: false, notifStatus: action.payload };
    case UPDATE_TASK_NOTIF_STATUS_BY_ID_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const updateTaskNotifNameLinkReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_TASK_NAME_LINK_REQUEST:
      return { isLoading: true };
    case UPDATE_TASK_NAME_LINK_SUCCESS:
      return { isLoading: false, notifNameLink: action.payload };
    case UPDATE_TASK_NAME_LINK_FAIL:
      return { isLoading: false, error: action.payload };
    default:
      return state;
  }
};
