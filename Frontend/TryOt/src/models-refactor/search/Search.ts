import {SearchItemsResponse} from '../../api-refactor/searchItemsApi';
import ProxyItem from '../items/ProxyItem';

class Search {
  private logId: number;
  private text: string[];
  private items: {[key: string]: number}[];
  private displayedItems: ProxyItem[] = [];

  private pagination: number = 20;
  private currPage: number = 1;
  private observers: React.Dispatch<React.SetStateAction<ProxyItem[]>>[] = [];

  constructor(searchResponse: SearchItemsResponse) {
    this.logId = searchResponse.log_id;
    this.text = searchResponse.text;
    this.items = [
      searchResponse.items.query,
      searchResponse.items.gpt_query1,
      searchResponse.items.gpt_query2,
      searchResponse.items.gpt_query3,
    ];
  }

  public addObserver(
    observer: React.Dispatch<React.SetStateAction<ProxyItem[]>>,
  ) {
    this.observers.push(observer);
  }

  private notifyObserver() {
    for (const observer of this.observers) {
      observer(
        this.displayedItems.slice(
          0,
          Math.min(this.pagination * this.currPage, this.displayedItems.length),
        ),
      );
    }
  }

  public select(targetIndex: boolean[]) {
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

    this.notifyObserver();
  }

  public nextPage() {
    this.currPage += 1;
    this.notifyObserver();
  }
}

export default Search;
