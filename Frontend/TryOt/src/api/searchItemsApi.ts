// searchItemsApi.ts
import axios from 'axios';

const BASE_URL =
  'https://dxw12un6m8.execute-api.ap-northeast-2.amazonaws.com/test/invocations';

interface SearchItemsResponse {
  user_id: number;
  log_id: number;
  text: string[]; //[오리지날 검색어, gpt 쿼리 1, gpt 쿼리 2, gpt 쿼리 3]
  items: {
    query: {[key: string]: number}; //key: item id, number: similarity score
    gpt_query1: {[key: string]: number};
    gpt_query2: {[key: string]: number};
    gpt_query3: {[key: string]: number};
  };
  timestamp: number;
}

export const searchItems = async (
  userId: number,
  text: string,
): Promise<SearchItemsResponse> => {
  try {
    const requestBody = {
      user_id: userId, //테스트라서 10으로 고정
      text: text,
    };
    const response = await axios.post<SearchItemsResponse>(
      BASE_URL,
      requestBody,
    );
    if (response.status === 200) {
      //console.log(response.data);
      return response.data;
    } else {
      const errorMessage =
        response.status === 400
          ? 'Your query is not related to Fashion.'
          : response.status === 424
          ? 'GPT is not available, please turn it off.'
          : response.status === 500
          ? 'Internal Server is not working.'
          : 'API request failed';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    throw new Error('API request failed');
  }
};
