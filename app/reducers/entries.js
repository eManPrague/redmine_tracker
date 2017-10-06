// @flow
import Immutable from 'immutable';

import {
  UPDATE_ENTRY,
  STOP_ENTRY,
  RESET_CURRENT_ENTRY
} from '../constants/actions';

const emptyCurrent = Immutable.fromJS({
  project: '',
  issue: 0,
  activity: 0,
  description: '',
  startTime: 0,
  stopTime: 0,
  synced: false
});

const initialState = Immutable.fromJS({
  current: emptyCurrent,
  history: []
});

export default (state: Immutable.Map<string, mixed> = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_ENTRY:
      return state.set(
        'current',
        state.get('current').merge(action.payload)
      );

    case STOP_ENTRY:
      return state.update('history', arr => arr.push(state.get('current').merge(action.payload)))
        .set('current', emptyCurrent);

    case RESET_CURRENT_ENTRY:
      return state.set('current', emptyCurrent);

    default:
      return state;
  }
};
