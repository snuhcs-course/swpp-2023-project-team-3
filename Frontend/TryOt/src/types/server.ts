export interface RequestTypes {
  post: {
    login: LogInInfo;
    register: Omit<UserInfo & LogInInfo, 'id'>;
  };
  delete: {};
  get: {
    'user/token-check': Token;
  };
}

export interface ResponseTypes {
  post: {
    login: UserInfo & Token;
    register: {};
  };
  delete: {};
  get: {
    'user/token-check': UserInfo & Token;
  };
}

export type Methods = 'post' | 'get' | 'delete';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  nickname: string;
  gender: 'M' | 'F';
  age: number;
}

export interface LogInInfo {
  username: string;
  password: string;
}

export interface Token {
  token: string;
}
