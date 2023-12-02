// clickLogApi.ts
import axios from 'axios';

const BASE_URL = 'http://3.34.1.54/history/search-item-record/';

export const clickLogApi = async (
    itemId: string,
    logId: number,
    similarity: number
) => {
    try {
        const requestBody = {
            item: parseInt(itemId, 10),
            search: parseInt(String(logId), 10),
            similarity: 1,
        };
        console.log(requestBody);
        const response = await axios.post(
            BASE_URL,
            requestBody,
        );
        if (response.status === 201) {
           console.log("click log success");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

