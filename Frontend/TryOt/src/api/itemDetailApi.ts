import axios from 'axios';
import {FashionItem} from '../models/FashionItem';
import {SearchQueryHistoryItem} from '../models/SearchQueryHistoryItem';
import ProxyItem from '../models-refactor/items/ProxyItem';

//Base url for calling item detail
const BASE_URL = 'http://3.34.1.54/items/item-info';

// Fetches the details of a fashion item.
export const fetchFashionItemDetails = async (
  itemId: string | ProxyItem,
): Promise<FashionItem> => {
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
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 아이템 상세페이지에서 검색 기록 새로 받아옴
export const reloadSearchQueryHistory = async (
  itemId: string,
): Promise<SearchQueryHistoryItem[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${itemId}`);
    return response.data.search_query_istory;
  } catch (error) {
    console.error('Error reloading and updating item data:', error);
    throw error;
  }
};
