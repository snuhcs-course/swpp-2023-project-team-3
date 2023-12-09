import {FashionItem} from '../../api-refactor/itemDetailApi';
import {searchItemsApi} from '../../api-refactor/searchItemsApi';
import ProxyItem from '../items/ProxyItem';

class Search {
  private userId: number;
  private apiBody: {
    searchQuery: string;
    gpt_query1?: string | undefined;
    gpt_query2?: string | undefined;
    gpt_query3?: string | undefined;
    prevScreen?: string | undefined;
  };
  private logId?: number;
  private text?: string[];
  private items?: {[key: string]: number}[];
  private displayedItems: ProxyItem[] = [];

  private pagination: number = 20;
  private currPage: number = 1;
  private observers: React.Dispatch<React.SetStateAction<FashionItem[]>>[] = [];

  constructor(
    userId: number,
    apiBody: {
      searchQuery: string;
      gpt_query1?: string | undefined;
      gpt_query2?: string | undefined;
      gpt_query3?: string | undefined;
      prevScreen?: string | undefined;
    },
  ) {
    this.userId = userId;
    this.apiBody = apiBody;
  }

  public async search(query?: string) {
    if (query) {
      this.apiBody = {searchQuery: query};
    }
    console.log(this.apiBody);
    const searchResponse = await searchItemsApi(this.userId, this.apiBody);
    this.logId = searchResponse.log_id;
    this.text = searchResponse.text;
    this.items = [
      searchResponse.items.query,
      searchResponse.items.gpt_query1,
      searchResponse.items.gpt_query2,
      searchResponse.items.gpt_query3,
    ];
    return searchResponse;
  }

  public addObserver(
    observer: React.Dispatch<React.SetStateAction<FashionItem[]>>,
  ) {
    this.observers.push(observer);
  }

  private async notifyObserver() {
    const newItemList = await Promise.all(
      this.displayedItems
        .slice(
          0,
          Math.min(this.pagination * this.currPage, this.displayedItems.length),
        )
        .map(value => value.getDetail()),
    );
    for (const observer of this.observers) {
      observer(newItemList);
    }
  }

  public async select(targetIndex: boolean[]) {
    if (this.items === undefined) {
      return;
    }
    const mergeItemDict = this.items.reduce((result, dictionary, index) => {
      if (targetIndex[index]) {
        for (const key in dictionary) {
          if (dictionary.hasOwnProperty(key)) {
            if (result[key] === undefined || dictionary[key] > result[key]) {
              result[key] = dictionary[key];
            }
          }
        }
      }
      return result;
    }, {});

    const sortedMergedItem = Object.entries(mergeItemDict).sort(
      (a, b) => b[1] - a[1],
    );

    this.displayedItems = sortedMergedItem.map(([id, _]) => new ProxyItem(id));
    await this.notifyObserver();
  }

  public async nextPage() {
    console.log('next page');
    this.currPage += 1;
    await this.notifyObserver();
  }
}

export default Search;
