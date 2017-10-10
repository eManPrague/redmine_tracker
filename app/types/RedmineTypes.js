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
  projectName: string,
  issue: number,
  issueName: string,
  activity: number,
  activityName: string,
  description: string,
  startTime: number,
  endTime: number,
  id?: number
};
