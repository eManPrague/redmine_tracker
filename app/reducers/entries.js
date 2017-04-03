// @flow
import Immutable from 'immutable';

import {
  START_ENTRY,
  UPDATE_ENTRY,
  STOP_ENTRY
} from '../constants/actions';

const initialState = Immutable.fromJS({
  current: {
    project: '',
    issue: 0,
    activity: 0,
    description: '',
    startTime: 0,
    stopTime: 0
  },
  history: []
});

export default (state: Immutable.Map<string, mixed> = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_ENTRY:
      return state.set(
        'current',
        state.get('current').merge(action)
      );

    default:
      return state;
  }
};
