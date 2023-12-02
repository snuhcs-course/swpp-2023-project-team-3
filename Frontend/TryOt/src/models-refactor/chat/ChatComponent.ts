abstract class ChatComponent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public add(component: ChatComponent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public remove(component: ChatComponent): void {}

  public isUserChat(): boolean {
    return false;
  }

  public abstract getData(): {}[];
}

export default ChatComponent;
