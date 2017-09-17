// @flow
/**
 * Reducer for loaded redmine data:
 * 1) Projects
 * 2) Issues
 * 3) Activities
 */
import Immutable from 'immutable';

import {
  SET_PROJECTS, SET_ISSUES, SET_ACTIVITIES, RESET_ALL
} from '../constants/actions';

const initialState = Immutable.fromJS({
  projects: [],
  issues: {},
  activities: {}
});

export default (state: Immutable.Map<string, mixed> = initialState, action: any) => {
  const payload = action.payload;
  switch (action.type) {
    case SET_PROJECTS:
      return state.set('projects', Immutable.fromJS(payload.projects));
    case SET_ISSUES:
      return state.setIn(['issues', payload.projectIdentifier], Immutable.fromJS(payload.issues));
    case SET_ACTIVITIES:
      return state.setIn(['activities', payload.projectIdentifier], Immutable.fromJS(payload.activities));
    case RESET_ALL:
      return initialState;
    default:
      return state;
  }
};
