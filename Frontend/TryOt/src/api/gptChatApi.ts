// searchItemsApi.ts
import axios from 'axios';

const BASE_URL =
  'https://w7jsadx3y1.execute-api.ap-northeast-2.amazonaws.com/chatbot/invocations';

interface GptChatResponse {
  user?: number;
  chatroom: number;
  query: string;
  summary?: string;
  answer: string;
  gpt_query1: string;
  gpt_query2: string;
  gpt_query3: string;
  items: {[key: number]: [number, number]};
}

type requestBody = {
  query: string;
  user: number;
  chatroom?: number;
};

export const gptChatApi = async (
  query: string,
  user: number,
  chatroom: number | undefined,
): Promise<GptChatResponse> => {
  try {
    const requestBody: requestBody = {
      query: query,
      user: user,
    };
    if (chatroom !== undefined) {
      requestBody.chatroom = chatroom;
    }

    const response = await axios.post<GptChatResponse>(BASE_URL, requestBody);
    console.log(response.data);
    if (response.status === 200) {
      console.log(response.data);
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
