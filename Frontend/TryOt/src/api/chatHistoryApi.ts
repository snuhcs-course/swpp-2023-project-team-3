// searchItemsApi.ts
import axios from 'axios';

const BASE_URL = 'http://3.34.1.54/history/chat';

export type ChatHistoryEntity = {
  id: number;
  log: number;

  query: string;
  is_deleted: boolean;
  timestamp: string;
  items: number[];
  gpt_chat: {
    id: number;
    user_chat: number;

    answer: string;
    gpt_query1: string;
    gpt_query2: string;
    gpt_query3: string;
    is_deleted: boolean;
    timestamp: string;
  }[];
};

export type ChatHistory = {
  id: number;
  user: number;
  user_chat: ChatHistoryEntity[];
  summary: string;
  is_deleted: boolean;
  timestamp: string;
};

export const chatHistoryApi = async (
  chatroom: number,
): Promise<ChatHistory> => {
  try {
    const response = await axios.get<ChatHistory>(`${BASE_URL}/${chatroom}`);
    if (response.status === 200) {
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
