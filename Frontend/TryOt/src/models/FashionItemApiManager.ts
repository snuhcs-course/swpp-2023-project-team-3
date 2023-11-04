import {fetchFashionItemDetails} from '../api/itemDetailApi';
import {searchItems} from '../api/searchItemsApi';
class FashionItemApiManager {
    async getFashionItemDetails(itemId: string) {
        try {
            const fashionItem = await fetchFashionItemDetails(itemId);
            return fashionItem;
        } catch (error) {
            throw new Error('Failed to fetch fashion item details');
        }
    }

    async searchItems(userId: number, text: string) {
        try {
            const searchResults = await searchItems(userId, text);
            return searchResults;
        } catch (error) {
            throw new Error('Failed to search items');
        }
    }
}

//TODO: 일단 이런식으로 만들면 될 것 같긴한데 쓸지는 모르겠다.
export default FashionItemApiManager;

