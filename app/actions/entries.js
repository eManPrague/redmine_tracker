// @flow
import {
  UPDATE_ENTRY,
  STOP_ENTRY
} from '../constants/actions';

export const updateEntry = (data: any) => ({
  type: UPDATE_ENTRY,
  payload: data
});

export const closeEntry = (endTime: number, autoSync: boolean) => ({
  type: STOP_ENTRY,
  payload: {
    autoSync,
    endTime
  }
});
