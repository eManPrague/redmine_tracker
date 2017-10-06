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
  issueId: number,
  activity: number,
  description: string,
  startTime: number,
  endTime: number,
  externalId?: number
};
