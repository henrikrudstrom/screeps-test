export interface Subscriber {
  recieve(message: any): void;
}

export interface Message {
  type: string;
}

export class MessageBus {
  private subscribers: { [name: string]: Subscriber[] }
  public static instance: MessageBus;

  public static Initialize(){
    this.instance = new MessageBus();
  }
  public constructor() {
    this.subscribers = {};
  }

  public subscribe(messageType: string, subscriber: Subscriber): void {
    if (this.subscribers[messageType] === undefined) {
      this.subscribers[messageType] = [];
    }
    if (this.subscribers[messageType].indexOf(subscriber) !== -1) {
      return;
    }
    this.subscribers[messageType].push(subscriber);
  }

  public publish(message: Message) {
    if(this.subscribers[message.type] === undefined){
      return;
    }
    this.subscribers[message.type].forEach((subscriber: Subscriber) => subscriber.recieve(message));
  }
}
