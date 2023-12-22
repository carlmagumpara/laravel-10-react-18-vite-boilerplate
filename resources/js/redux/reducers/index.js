import { combineReducers } from 'redux';
import userReducer from './user';
import tokenReducer from './token';
import { loginApi } from '../services/login';
import { registerApi } from '../services/register';
import { userApi } from '../services/user';
import { dashboardApi } from '../services/dashboard';
import { fileApi } from '../services/files';
import { profileApi } from '../services/profile';
import { notificationApi } from '../services/notifications';
import { conversationApi } from '../services/conversations';

const appReducer = combineReducers({
  user: userReducer,
  token: tokenReducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [registerApi.reducerPath]: registerApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [conversationApi.reducerPath]: conversationApi.reducer,
});

export const servicesMiddleware = [
  loginApi.middleware,
  registerApi.middleware,
  userApi.middleware,
  dashboardApi.middleware,
  fileApi.middleware,
  profileApi.middleware,
  notificationApi.middleware,
  conversationApi.middleware,
];

export default appReducer;