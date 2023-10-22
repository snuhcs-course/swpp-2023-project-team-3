import axios, {AxiosError} from 'axios';
import {ResponseTypes, RequestTypes, Methods} from '../types/server';
import {serverName} from '../constants/dev';

export default async function tryAxios<
  Method extends Methods,
  Type extends keyof RequestTypes[Method] & keyof ResponseTypes[Method],
>(
  method: Method,
  query: Type,
  requestData?: RequestTypes[Method][Type],
): Promise<ResponseTypes[Method][Type]> {
  try {
    let form: {
      method: Methods;
      url: string;
      data?: RequestTypes[Method][Type];
      params?: RequestTypes[Method][Type];
    } = {
      method,
      url: `${serverName}/${query as string}`,
    };
    form[method == 'get' ? 'params' : 'data'] = requestData;
    const {data} = await axios(form);

    //TODO : reponse data 타입 체크 by io-ts

    return data;
  } catch (err) {
    throw new Error((err as AxiosError).message);
  }
}
