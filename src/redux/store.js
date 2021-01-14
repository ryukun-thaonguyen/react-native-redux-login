import _ from 'lodash';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import config from '../config/DebugSettings';
import reduxPersist from '../config/ReduxPersist';
import rootSaga from './sagas';
import rootReducer from './reducers';

export default onComplete => {
  console.log("config");
  /* ------------- Redux Configuration ------------- */
  const middleware = [];
  const enhancers = [];
  /* ------------- Saga Middleware ------------- */
  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);
  /* ------------- Logger Middleware ------------- */
  const SAGA_LOGGING_BLACKLIST = [
    'EFFECT_TRIGGERED',
    'EFFECT_RESOLVED',
    'EFFECT_REJECTED',
    'persist/REHYDRATE',
  ];

  if (__DEV__) {
    // the logger master switch
    const USE_LOGGING = config.reduxLogging;
    // silence these saga-based messages
    // create the logger
    const logger = createLogger({
      predicate: (getState, { type }) => USE_LOGGING && !_.includes(SAGA_LOGGING_BLACKLIST, type),
    });
    middleware.push(logger);
  }
  
  enhancers.push(applyMiddleware(...middleware));
  const persistedReducer = persistReducer(reduxPersist, combineReducers(rootReducer));
  const store = createStore(persistedReducer, compose(...enhancers));
  const persistor = persistStore(store, {}, () => onComplete(store, persistor));
  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};
