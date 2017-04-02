// @flow
import Immutable from 'immutable';

import {
  START_ENTRY,
  STOP_ENTRY
} from '../constants/actions';

const initialState = Immutable.fromJS({
  currentEntry: null,
  history: []
});

export default (state: Immutable.Map<string, mixed> = initialState, action: any) => {
  switch (action.type) {
    case START_ENTRY:
      return state.set('current', Immutable.fromJS(action));

    case STOP_ENTRY:
      return state.set('current', null);

    default:
      return state;
  }
};
