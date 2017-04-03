// @flow
import {
  START_ENTRY,
  UPDATE_ENTRY,
  STOP_ENTRY
} from '../constants/actions';

export const updateEntry = (data: any) => ({
  type: UPDATE_ENTRY,
  ...data
});

export const startEntry = (startTime: number) => (dispatch: Dispatch) => ({

});


export const stopEntry = (endTime: number) => ({
  type: STOP_ENTRY,
  endTime
});

export const closeEntry = (endTime: number, autoSync: boolean) => ({
  type: STOP_ENTRY,
  autoSync,
  endTime
});
