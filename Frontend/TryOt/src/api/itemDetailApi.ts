import axios from 'axios';
import {FashionItem} from '../models/FashionItem';

//Base url for calling item detail
const BASE_URL = 'http://3.34.1.54/items/item-info';

// Fetches the details of a fashion item.
export const fetchFashionItemDetails = async (
  itemId: string,
): Promise<FashionItem> => {
  try {
    const response = await axios.get(`${BASE_URL}/${itemId}`);
    const itemData = response.data;
    return {
      id: itemData.id.toString(),
      itemUrl: itemData.order_url,
      imageUrl: itemData.image_url,
      brand: itemData.brand.name,
      shortDescription: itemData.name,
      description: itemData.description,
      category: itemData.category.map((cat: {name: any}) => cat.name),
      gender: itemData.gender,
      price: parseFloat(itemData.price),
    };
  } catch (error) {
    throw error;
  }
};

