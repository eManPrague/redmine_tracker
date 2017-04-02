// @flow
import {
  START_ENTRY,
  STOP_ENTRY
} from '../constants/actions';

export const startEntry = (project: string, issue: number, description: string,
  activity: number, startTime: number) => ({
    type: START_ENTRY,
    project,
    issue,
    description,
    activity,
    startTime
  });

export const stopEntry = (endTime: number) => ({
  type: STOP_ENTRY,
  endTime
});
