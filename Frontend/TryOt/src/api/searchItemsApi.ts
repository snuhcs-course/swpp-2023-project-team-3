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
      gpt_usable: 1,
      target_index: [1,1,1,1],
    };

    const response = await axios.post<SearchItemsResponse>(
      BASE_URL,
      requestBody,
    );
    console.log(response.data)
    if (response.data.response == 0) {
      return response.data;
    } else {
      console.log("ddddd");
      console.log(response.data);
      throw new Error('API response indicates failure');
    }
  } catch (error) {
    console.log(error);
    throw new Error(`API request failed`);
  }
};

//TODO: add clicked item
