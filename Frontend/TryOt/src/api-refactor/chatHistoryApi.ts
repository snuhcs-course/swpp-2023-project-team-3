// searchItemsApi.ts
import axios from 'axios';
import {DATABASE_URL} from './config/endpoint';
import ChatComponent from '../models-refactor/chat/ChatComponent';
import UserChat from '../models-refactor/chat/UserChat';
import GptChat from '../models-refactor/chat/GptChat';

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
): Promise<ChatComponent> => {
  try {
    const response = await axios.get<ChatHistory>(
      `${DATABASE_URL}/history/chat/${chatroom}`,
    );
    if (response.status === 200) {
      let chatHistory: ChatComponent | undefined;

      for (const data of response.data.user_chat) {
        const userChat = new UserChat(data.query);
        for (const gptData of data.gpt_chat) {
          const gptChat = new GptChat(gptData.answer, data.items);
          userChat.add(gptChat);
        }
        if (chatHistory) {
          chatHistory.add(userChat);
        } else {
          chatHistory = userChat;
        }
      }

      return chatHistory!;
    } else {
      console.log(response.data);
      throw new Error('API response indicates failure');
    }
  } catch (error) {
    console.log(error);
    throw new Error('API request failed');
  }
};
