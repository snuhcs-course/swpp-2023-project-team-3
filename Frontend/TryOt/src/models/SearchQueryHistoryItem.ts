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
