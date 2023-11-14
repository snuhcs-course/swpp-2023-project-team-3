import axios from 'axios';
import {ChatRequestType} from '../models/ChatRequestType';

//Base url for calling item detail
const BASE_URL = 'http://43.201.105.74/items/item-info';

// Fetches the details of a fashion item.
export const fetchFashionItemDetails = async (
  chatRequest: ChatRequestType,
): Promise<number | null> => {
  try {
    console.log(`Calling ${BASE_URL}/ with body ${chatRequest}`);
    const response = await axios({
      method: 'POST',
      url: BASE_URL,
      data: chatRequest,
    });

    const chatroom_id = response.data;

    return chatroom_id;
  } catch (error) {
    throw error;
  }
};
