import axios from 'axios';

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

export const registerTaskAssignedNotif =
  (assignedNotifInfo) => async (dispatch) => {
    try {
      dispatch({
        type: REGISTER_NOTIFICATION_REQUEST,
      });
      await axios({
        method: 'post',
        url: `http://localhost:5000/api/notification/`,
        data: assignedNotifInfo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem('tokenId')
          )}`,
        },
      }).then((res) => {
        dispatch({
          type: REGISTER_NOTIFICATION_SUCCESS,
          payload: res.data,
        });
      });
    } catch (error) {
      dispatch({
        type: REGISTER_NOTIFICATION_FAIL,
        payload:
          error.response && error.response.data
            ? error.response.data
            : error.message,
      });
    }
  };

// export const registerTaskDescNotif = (descNotifInfo) => async (dispatch) => {
//   try {
//     dispatch({
//       type: REGISTER_DESC_NOTIF_REQUEST,
//     });
//     await axios({
//       method: 'post',
//       url: `http://localhost:5000/api/notification/description`,
//       data: descNotifInfo,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
//       },
//     }).then((res) => {
//       console.log(res.data);
//       dispatch({
//         type: REGISTER_DESC_NOTIF_SUCCESS,
//         payload: res.data,
//       });
//     });
//   } catch (error) {
//     dispatch({
//       type: REGISTER_DESC_NOTIF_FAIL,
//       payload:
//         error.response && error.response.data
//           ? error.response.data
//           : error.message,
//     });
//   }
// };

export const getNotificationByUserId = (receiverId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_NOTIFICATION_BY_USER_ID_REQUEST,
    });

    await axios({
      method: 'GET',
      url: `http://localhost:5000/api/notification/${receiverId}`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      localStorage.setItem('notifications', JSON.stringify(res.data));

      dispatch({
        type: GET_NOTIFICATION_BY_USER_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: GET_NOTIFICATION_BY_USER_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const updateNotificationStatusById = (notifId) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_TASK_NOTIF_STATUS_BY_ID_REQUEST,
    });

    await axios({
      method: 'PUT',
      url: `http://localhost:5000/api/notification/${notifId}`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: UPDATE_TASK_NOTIF_STATUS_BY_ID_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TASK_NOTIF_STATUS_BY_ID_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const updateNotificationNameLink = (taskInfo) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_TASK_NAME_LINK_REQUEST,
    });

    await axios({
      method: 'PUT',
      url: `http://localhost:5000/api/notification/`,
      data: taskInfo,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('tokenId'))}`,
      },
    }).then((res) => {
      dispatch({
        type: UPDATE_TASK_NAME_LINK_SUCCESS,
        payload: res.data,
      });
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TASK_NAME_LINK_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
