import axios from 'axios';

//Base url for calling item detail
const BASE_URL = 'http://3.34.1.54/items/item-info';

export interface SearchQueryHistoryItem {
  id: number;
  query: string;
  gpt_query1: string;
  gpt_query2: string;
  gpt_query3: string;
  is_deleted: boolean;
  timestamp: string;
  user: number;
  items: number[];
}

export interface ChatQueryHistoryItem {
  id: number;
  query: string;
  is_deleted: boolean;
  timestamp: string;
  log: number;
  items: number[];
}

export interface FashionItem {
  id: string;
  itemUrl: string;
  imageUrl: string[];
  brand: string;
  shortDescription: string;
  description: string;
  category: string[];
  gender: string;
  price: number;
  search_query_istory: SearchQueryHistoryItem[];
  chat_query_history: ChatQueryHistoryItem[];
}

// Fetches the details of a fashion item.
export const itemDetailApi = async (itemId: string): Promise<FashionItem> => {
  try {
    const response = await axios.get(`${BASE_URL}/${itemId}`);
    const itemData = response.data;
    return {
      id: itemData.id,
      itemUrl: itemData.order_url,
      imageUrl: itemData.image_url,
      brand: itemData.brand.name,
      shortDescription: itemData.name,
      description: itemData.description,
      category: itemData.category.map((cat: {name: any}) => cat.name),
      gender: itemData.gender,
      price: parseFloat(itemData.price),
      search_query_istory: itemData.search_query_istory,
      chat_query_history: itemData.chat_query_history,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
