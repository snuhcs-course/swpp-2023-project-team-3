// searchItemsApi.ts
import axios from 'axios';

const BASE_URL =
  'https://dxw12un6m8.execute-api.ap-northeast-2.amazonaws.com/test/invocations';

interface SearchItemsResponse {
  response: number;
  user_id: number;
  item_ids: string[];
  timestamp: number;
  text: string[]; //refined_queries
  target_index: number[];
}

//response: 0, 1, 2

export const searchItems = async (
    userId: number,
    searchText: string[],
    gpt_usable: number,
    target_index: number[],
): Promise<SearchItemsResponse> => {
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
    console.log(response.data)
    if (response.data.response == 0) {
      return response.data;
    } else {
      console.log(response.data);
      throw new Error('API response indicates failure');
    }
  } catch (error) {
    console.log(error);
    throw new Error(`API request failed`);
  }
};
