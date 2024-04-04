type ListenerFunction = (data?: any) => void;

export class PubSubProvider {
  private static instance: PubSubProvider;
  private topics: { [key: string]: ListenerFunction[] } = {};

  private constructor() {}

  public static getInstance(): PubSubProvider {
    if (!PubSubProvider.instance) {
      PubSubProvider.instance = new PubSubProvider();
    }
    return PubSubProvider.instance;
  }

  subscribe(topic: string, listener: ListenerFunction): void {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(listener);
  }

  publish(topic: string, data?: any): void {
    if (!this.topics[topic] || this.topics[topic].length < 1) return;
    this.topics[topic].forEach((listener) => listener(data));
  }
}
