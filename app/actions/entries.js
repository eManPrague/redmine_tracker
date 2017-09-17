// @flow
import {
  UPDATE_ENTRY,
  STOP_ENTRY
} from '../constants/actions';

import type { EntryType } from '../types/EntryType';

export const updateEntry = (data: EntryType) => ({
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
