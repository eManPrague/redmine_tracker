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
