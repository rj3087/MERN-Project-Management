import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {
  accountRegisterReducer,
  accountActivationReducer,
  accountLoginReducer,
  forgotPasswordReducer,
  resetPasswordReducer,
  accountGetReducer,
  accountGetByIdReducer,
  accountsGetReducer,
  accountUpdateReducer,
  accountUploadProfileReducer,
  accountPasswordUpdateReducer,
} from './redux/reducers/accountReducers';

import {
  projectRegisterReducer,
  projectGetByIdReducer,
  projectGetListTaskByIdReducer,
  projectDeletedByIdReducer,
  projectUpdateByIdReducer,
  projectListGetReducer,
} from './redux/reducers/projectReducers';

import {
  taskRegisterReducer,
  taskUpdateByIdReducer,
  taskGetByIdReducer,
  taskGetByNameReducer,
  taskListGetReducer,
  taskUploadAttachmentsReducer,
  taskDeleteByIdReducer,
  taskDeleteAttachmentReducer,
  taskDeleteAttachmentFileReducer,
} from './redux/reducers/taskReducers';

import { conversationGetByIdReducer } from './redux/reducers/conversationReducers';

import {
  messageRegisterReducer,
  messageGetByIdReducer,
  messageListGetReducer,
  messageUpdateSeenReducer,
  messageUploadAttachmentsReducer,
} from './redux/reducers/messageReducers';

import {
  registerTaskAssignedNotifReducer,
  registerTaskDescNotifReducer,
  getTaskNotificationByUserIdReducer,
  updateTaskNotifStatusByIdReducer,
  updateTaskNotifNameLinkReducer,
} from './redux/reducers/notificationReducers';

import {
  registerTaskCommentReducer,
  getTaskCommentReducer,
} from './redux/reducers/commentReducers';

import {
  departmentRegisterReducer,
  departmentListGetReducer,
  departmentGetByIdReducer,
  clientRegisterReducer,
  clientGetByIdReducer,
  clientListGetReducer,
  teamRegisterReducer,
  teamByIdGetReducer,
  teamListGetReducer,
} from './redux/reducers/utilitiesReducers';

const reducer = combineReducers({
  accountRegister: accountRegisterReducer,
  accountActivation: accountActivationReducer,
  accountLogin: accountLoginReducer,
  passwordForgot: forgotPasswordReducer,
  passwordReset: resetPasswordReducer,
  accountGet: accountGetReducer,
  accountGetById: accountGetByIdReducer,
  accountsGet: accountsGetReducer,
  accountUpdate: accountUpdateReducer,
  accountPasswordUpdate: accountPasswordUpdateReducer,
  accountUploadProfile: accountUploadProfileReducer,
  projectRegister: projectRegisterReducer,
  projectGetListTaskById: projectGetListTaskByIdReducer,
  projectGetById: projectGetByIdReducer,
  projectDeletedById: projectDeletedByIdReducer,
  projectUpdateById: projectUpdateByIdReducer,
  projectListGet: projectListGetReducer,
  taskRegister: taskRegisterReducer,
  taskUpdateById: taskUpdateByIdReducer,
  taskGetById: taskGetByIdReducer,
  taskGetByName: taskGetByNameReducer,
  taskListGet: taskListGetReducer,
  taskUploadAttachments: taskUploadAttachmentsReducer,
  taskDeleteById: taskDeleteByIdReducer,
  taskDeleteAttachment: taskDeleteAttachmentReducer,
  taskDeleteAttachmentFile: taskDeleteAttachmentFileReducer,
  conversationGetById: conversationGetByIdReducer,
  messageRegister: messageRegisterReducer,
  messageGetById: messageGetByIdReducer,
  messageListGet: messageListGetReducer,
  messageUpdateSeen: messageUpdateSeenReducer,
  messageUploadAttachments: messageUploadAttachmentsReducer,
  registerTaskAssignedNotif: registerTaskAssignedNotifReducer,
  // registerDescNotifTask: registerTaskDescNotifReducer,
  getTaskNotificationByUserId: getTaskNotificationByUserIdReducer,
  updateNotifTaskStatusById: updateTaskNotifStatusByIdReducer,
  updateTaskNotifNameLink: updateTaskNotifNameLinkReducer,
  registerTaskComment: registerTaskCommentReducer,
  getTaskComment: getTaskCommentReducer,
  departmentRegister: departmentRegisterReducer,
  departmentGetById: departmentGetByIdReducer,
  departmentListGet: departmentListGetReducer,
  clientRegister: clientRegisterReducer,
  clientGetById: clientGetByIdReducer,
  clientListGet: clientListGetReducer,
  teamRegister: teamRegisterReducer,
  teamByIdGet: teamByIdGetReducer,
  teamListGet: teamListGetReducer,
});

const accountInfoFromLocalStorage = localStorage.getItem('loginAccount')
  ? JSON.parse(localStorage.getItem('loginAccount'))
  : null;

const initialState = {
  accountLogin: { currentAccountInfo: accountInfoFromLocalStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
