// @flow
import { combineReducers } from 'redux-immutable';

// Local reducers
import user from './user';
import ui from './ui';
import data from './data';
import entries from './entries';
import routing from './routing';

const rootReducer = combineReducers({
  entries,
  data,
  ui,
  routing,
  user
});

export default rootReducer;
