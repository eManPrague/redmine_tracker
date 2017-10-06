// @flow
import { combineReducers } from 'redux-immutable';

// Local reducers
import user from './user';
import ui from './ui';
import data from './data';
import entries from './entries';
import router from './router';

const rootReducer = combineReducers({
  entries,
  data,
  ui,
  router,
  user
});

export default rootReducer;
