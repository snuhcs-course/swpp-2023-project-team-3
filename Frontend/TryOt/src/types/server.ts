export interface RequestTypes {
  post: {
    'user/login/': LogInInfo;
    'user/register/': Omit<UserInfo & LogInInfo, 'id'>;
  };
  delete: {};
  get: {
    'user/token-check/': {url : string};
  };
}

export interface ResponseTypes {
  post: {
    'user/login/': UserInfo & Token;
    'user/register/': {};
  };
  delete: {};
  get: {
    'user/token-check/': UserInfo & Token;
  };
}

export type Methods = 'post' | 'get' | 'delete';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  nickname: string;
  gender: 'M' | 'F' | 'U';
  age: number;
}

export interface LogInInfo {
  username: string;
  password: string;
}

export interface Token {
  token: string;
}
