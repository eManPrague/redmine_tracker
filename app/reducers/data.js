/**
 * Reducer for loaded redmine data:
 * 1) Projects
 * 2) Issues
 * 3) Activities
 */
import Immutable from 'immutable';

import {
  SET_PROJECTS, SET_ISSUES, SET_ACTIVITIES
} from '../constants/actions';

const initialState = Immutable.fromJS({
  projects: [],
  issues: {},
  activities: {}
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return state.set('projects', action.projects);
    case SET_ISSUES:
      return state.setIn(['issues', action.projectIdentifier], action.issues);
    case SET_ACTIVITIES:
      return state.set('activities', action.activities);
    default:
      return state;
  }
};
