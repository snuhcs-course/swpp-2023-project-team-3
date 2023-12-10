import ChatComponent, {ChatInfo} from './ChatComponent';

class UserChat extends ChatComponent {
  protected children: ChatComponent[] = [];

  private query: string;

  constructor(query: string) {
    super();
    this.query = query;
  }

  public add(component: ChatComponent): void {
    this.children.push(component);
  }
  public remove(component: ChatComponent): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);
  }

  public isUserChat(): boolean {
    return true;
  }

  public getData() {
    let results: ChatInfo = [];
    for (const child of this.children) {
      results = results.concat(child.getData());
    }
    return [{content: this.query}, ...results];
  }
}

export default UserChat;
