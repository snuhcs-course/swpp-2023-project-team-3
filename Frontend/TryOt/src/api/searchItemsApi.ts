// searchItemsApi.ts
import axios from 'axios';

const BASE_URL =
  'https://dxw12un6m8.execute-api.ap-northeast-2.amazonaws.com/test/invocations';

interface SearchItemsResponse {
  response: string;
  user_id: number;
  item_ids: string[];
  timestamp: number;
  gpt_usable: boolean;
  text: string[]; //refined_queries
  target_index: string[];
}

//reponse: 0, 1, 2

export const searchItems = async (
  userId: number,
  searchText: string[],
  gpt_usable: boolean,
  target_index: string[],

): Promise<string[]> => {
  try {
    const requestBody = {
      user_id: 10, //테스트라서 10으로 고정
      text: searchText,
      gpt_usable: gpt_usable,
      target_index: target_index,
    };

    const response = await axios.post<SearchItemsResponse>(
      BASE_URL,
      requestBody,
    );

    if (response.data.response === 'Sucess') {
      return response.data.item_ids;
    } else {
      throw new Error('API response indicates failure');
    }
  } catch (error) {
    throw new Error(`API request failed`);
  }
};
