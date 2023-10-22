import axios from 'axios';
import {FashionItem} from '../models/FashionItem';

//Base url for calling item detail
const BASE_URL = 'http://43.201.105.74/items/item-info';

// Fetches the details of a fashion item.
export const fetchFashionItemDetails = async (
  itemId: string,
): Promise<FashionItem> => {
  try {
    console.log(`Calling ${BASE_URL}/${itemId}`);
    const response = await axios.get(`${BASE_URL}/${itemId}`);

    const itemData = response.data;

    return {
      id: itemData.id.toString(),
      itemUrl: itemData.order_url,
      imageUrl: itemData.image_url,
      brand: itemData.brand.name,
      shortDescription: itemData.name,
      description: itemData.description,
      category: itemData.category.map((cat: {name: any}) => cat.name), //fix category type
      gender: itemData.gender,
      price: parseFloat(itemData.price),
    };
  } catch (error) {
    throw error;
  }
};
