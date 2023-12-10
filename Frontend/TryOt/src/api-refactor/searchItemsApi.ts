import axios from 'axios';
import {SEARCH_URL} from './config/endpoint';

interface SearchItemsResponse {
  statusCode?: number;
  errorMessage?: string;
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

export const searchItemsApi = async (
  userId: number,
  query: Readonly<{
    searchQuery: string;
    gpt_query1?: string;
    gpt_query2?: string;
    gpt_query3?: string;
  }>,
): Promise<SearchItemsResponse> => {
  const requestFormat: {
    query?: string;
    text?: string;
    gpt_query1?: string;
    gpt_query2?: string;
    gpt_query3?: string;
  } = {};
  if ('gpt_query1' in query) {
    requestFormat.query = query.searchQuery;
    requestFormat.gpt_query1 = query.gpt_query1;
    requestFormat.gpt_query2 = query.gpt_query2;
    requestFormat.gpt_query3 = query.gpt_query3;
  } else {
    requestFormat.text = query.searchQuery;
  }
  const requestBody = {
    user_id: userId,
    ...requestFormat,
  };
  const response = await axios.post<SearchItemsResponse>(
    SEARCH_URL,
    requestBody,
  );

  if (response.status === 200) {
    //console.log(response.data);
    const responseData = response.data;
    // Check if there is a 'statusCode' key in the response data
    if ('statusCode' in responseData) {
      if (responseData.statusCode !== 200) {
        // Handle non-200 status code
        console.log(responseData);
        const errorMessage = responseData.errorMessage ?? 'Search Failed. Please try again.';
        console.log(errorMessage);
        throw new Error(errorMessage);
      }
    }
    return responseData;
  } else {
    throw new Error('Search Failed. Please try again.');
  }
};
