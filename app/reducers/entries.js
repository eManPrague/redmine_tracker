// @flow
import Immutable from 'immutable';

import {
  UPDATE_CURRENT_ENTRY,
  RESET_CURRENT_ENTRY,
  STOP_ENTRY,
  UPDATE_ENTRY,
  DELETE_ENTRY,
  CLEAR_ENTRIES
} from '../constants/actions';

const emptyCurrent = Immutable.fromJS({
  project: '',
  projectName: '',
  issue: 0,
  issueName: '',
  activity: 0,
  activityName: '',
  description: '',
  startTime: 0,
  endTime: 0
});

const initialState = Immutable.fromJS({
  current: emptyCurrent,
  history: []
});

export default (state: Immutable.Map<string, mixed> = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_CURRENT_ENTRY:
      return state.set(
        'current',
        state.get('current').merge(action.payload)
      );

    case RESET_CURRENT_ENTRY:
      return state.set('current', emptyCurrent);

    case STOP_ENTRY:
      return state.update('history', arr => arr.unshift(state.get('current').merge(action.payload)))
        .set('current', emptyCurrent);

    case DELETE_ENTRY:
      return state.set('history', state.get('history').delete(action.payload.index));

    case UPDATE_ENTRY: {
      const index = action.payload.index;
      const currentEntry = state.get('history').get(index);
      return state.setIn(['history', index], currentEntry.merge(action.payload.entry));
    }

    case CLEAR_ENTRIES: {
      return initialState;
    }

    default:
      return state;
  }
};
