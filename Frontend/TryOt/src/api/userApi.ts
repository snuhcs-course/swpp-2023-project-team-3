import axios from 'axios';
import {ClickLog} from "../models/ClickLog";
import EncryptedStorage from "react-native-encrypted-storage";

const BASE_URL = 'http://3.34.1.54';

interface ChangeUserPasswordResponse {
  response: string;
  user_id: number;
  token: string;
}


export const ChangeUserPassword = async (
  userId: number,
  oldPassword: string,
  newPassword: string,
): Promise<string> => {
  try {
    const requestBody = {
      user_id: userId,
      old_password: oldPassword,
      new_password: newPassword,
    };

      const userToken = await EncryptedStorage.getItem('accessToken');

      const headers = {
          Authorization: `Token ${userToken}`, // Add the authorization header
      };

      const response = await axios.put<ChangeUserPasswordResponse>(
          `${BASE_URL}/user/change-password/`, // Use template literals for string concatenation
          requestBody,
          { headers }
      );

      if (response.data.response === 'HTTP_200_OK') {
      return response.data.token;
    } else if (response.data.response === 'HTTP_400_BAD_REQUEST') {
      throw new Error('Old password is not correct');
    }
    return '';
  } catch (error) {
      console.log(error);
    throw new Error(`API request failed`);
  }
};

export const fetchClickLog = async (
    userId: number,
    ): Promise<ClickLog[]> => {
    try {
        console.log("Fetching click log");
        const response = await axios.get(`http://3.34.1.54/history/item-click-view/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching click log:', error);
        throw error;
    }
    }
