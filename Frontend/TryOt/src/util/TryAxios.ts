import axios, { AxiosError } from "axios";
import { ResponseTypes, RequestTypes, Methods } from "../types/server";
import { serverName } from "../constants/dev";

export default async function tryAxios<Method extends Methods,Type extends (keyof RequestTypes[Method]) & (keyof ResponseTypes[Method]) >(method : Method,query : Type, requestData? : RequestTypes[Method][Type]) : Promise<ResponseTypes[Method][Type]>{
    try{
        const {data} = await axios({
            method, url : `${serverName}/${query as string}/`, data : requestData
        })
        return data
    }catch(err){
        throw new Error((err as AxiosError).message)
    }
}