//entire fashion item model (API에서 받아오는 데이터)
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
}
