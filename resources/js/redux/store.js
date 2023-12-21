import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import appReducer, { servicesMiddleware } from './reducers';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import logger from 'redux-logger';
import { name as key } from '../../../package.json';

const persistConfig = {
  key,
  storage
};

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    const {} = state
    state = {};
  }

  return appReducer(state, action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [ 
    thunk, 
    // logger, 
    ...servicesMiddleware 
  ],
});

let persistor = persistStore(store);

export {
  store,
  persistor,
};