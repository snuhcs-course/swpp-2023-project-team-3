import axios from 'axios';
import {ClickLog} from "../models/ClickLog";

const BASE_URL = 'http://43.201.105.74/';

interface ChangeUserPasswordResponse {
  response: string;
  user_id: number;
  token: string;
}

//TODO: 리팩토링 필요
export const ChangeUserPassword = async (
  userId: number,
  oldPassword: string,
  newPassword: string,
): Promise<string> => {
  try {
    const requestBody = {
      user_id: userId, //테스트라서 10으로 고정
      old_password: oldPassword,
      new_password: newPassword,
    };

    const response = await axios.post<ChangeUserPasswordResponse>(
      BASE_URL,
      requestBody,
    );

    if (response.data.response === 'HTTP_200_OK') {
      return response.data.token;
    } else if (response.data.response === 'HTTP_400_BAD_REQUEST') {
      throw new Error('Old password is not correct');
    }

    return '';
  } catch (error) {
    throw new Error(`API request failed`);
  }
};

export const fetchClickLog = async (
    userId: number,
    ): Promise<ClickLog[]> => {
    try {
        const response = await axios.get(`http://3.34.1.54/history/item-click-view/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching click log:', error);
        throw error;
    }
    }
