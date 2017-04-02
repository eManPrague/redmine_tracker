// @flow
import { combineReducers } from 'redux-immutable';

// Local reducers
import routing from './routing';
import user from './user';
import ui from './ui';
import data from './data';
import entries from './entries';

const rootReducer = combineReducers({
  entries,
  data,
  routing,
  ui,
  user
});

export default rootReducer;
