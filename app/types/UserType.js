// @flow
export type User = {
  id: number,
  lastname: string,
  firstname: string,
  mail: string,
  api_key: string
};

export type Info = {
  server: string,
  token: string,
  user: User
};

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
  endTime: number
};
