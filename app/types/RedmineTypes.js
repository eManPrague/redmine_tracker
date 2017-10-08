// @flow
export type Issue = {
  id: number,
  subject: string,
  userId?: number
};

export type Project = {
  identifier: string,
  name: string
};

export type Entry = {
  project: string,
  issue: number,
  activity: number,
  description: string,
  startTime: number,
  endTime: number,
  id?: number
};
