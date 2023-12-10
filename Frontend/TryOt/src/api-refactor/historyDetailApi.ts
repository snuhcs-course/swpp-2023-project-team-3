// searchItemsApi.ts
import axios from 'axios';
import {DATABASE_URL} from './config/endpoint';

export type catalogHistory = {
  id: number;
  user: number;
  query: string;
  gpt_query1: string;
  gpt_query2: string;
  gpt_query3: string;
  is_deleted: boolean;
  timestamp: Date;
  items: string[];
};
export type chatHistory = {
  id: number;
  user: number;
  summary: string;
  is_deleted: boolean;
  timestamp: Date;
};
export type historyDetailResponse = (catalogHistory | chatHistory)[];

export const historyDetailApi = async (
  user: number,
): Promise<historyDetailResponse> => {
  try {
    const response = await axios.get<historyDetailResponse>(
      `${DATABASE_URL}/history/detail/${user}`,
    );
    if (response.status === 200) {
      const result = response.data;
      for (let i = 0; i < result.length; i++) {
        result[i].timestamp = new Date(result[i].timestamp);
      }
      return response.data;
    } else {
      console.log(response.data);
      throw new Error('API response indicates failure');
    }
  } catch (error) {
    console.log(error);
    throw new Error('API request failed');
  }
};
