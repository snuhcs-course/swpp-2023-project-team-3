import {FashionItem, itemDetailApi} from '../../api-refactor/itemDetailApi';

class ProxyItem {
  protected itemId: string;
  private itemDetail: FashionItem | null;

  constructor(itemId: string) {
    this.itemId = itemId;
    this.itemDetail = null;
  }

  async getDetail(): Promise<FashionItem> {
    if (this.itemDetail == null) {
      this.itemDetail = await itemDetailApi(this.itemId);
    }
    return this.itemDetail;
  }
}

export default ProxyItem;
