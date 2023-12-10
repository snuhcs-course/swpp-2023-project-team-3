//entire fashion item model (API에서 받아오는 데이터)
import {SearchQueryHistoryItem} from "./SearchQueryHistoryItem";
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
}
