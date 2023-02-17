import { Message } from "../field/message";
import * as G from "../helpers/typeGuards";

type Key<O> = keyof O;
type Value<O> = O[keyof O];

export class FFRecord<O extends object = {}> {
  private value: O;
  private messages: Array<Message>;

  constructor(record: O) {
    this.value = record;
    this.messages = [];
  }

  get(key: Key<O>): Value<O> {
    return this.value[key];
  }

  set(key: Key<O>, value: Value<O>): void {
    this.value[key] = value;
  }

  public addMessage(key: Key<O>, message: Message): void {
    this.messages.concat(message);
  }

  public getMessages(): Array<Message> {
    return this.messages;
  }
}

export interface FlatfileRecord<O extends object = {}> {
  get(key: Key<O>): Value<O>;
  set(key: Key<O>, value: Value<O>): this;
  modify(key: Key<O>, handler: (value: Value<O>) => typeof value): this;
  addInfo(key: Key<O>, message: string): this;
  addInfo(keys: Array<Key<O>>, message: string): this;
  addWarning(key: Key<O>, message: string): this;
  addWarning(keys: Array<Key<O>>, message: string): this;
  addError(key: Key<O>, message: string): this;
  addError(keys: Array<Key<O>>, message: string): this;
}

export class FlatfileRecordBuilder<O extends object>
  implements FlatfileRecord<O>
{
  private flatfileRecord: FFRecord<O>;

  constructor(record: O) {
    this.flatfileRecord = new FFRecord<O>(record);
  }

  /**
   * Get a field value.
   *
   * @param {string} key
   * @returns unknown
   */
  get(key: Key<O>): Value<O> {
    return this.flatfileRecord.get(key);
  }

  /**
   * Set a field value.
   *
   * @param {string} key
   * @param {(string|number|object)} value
   * @returns this
   */
  set(key: Key<O>, value: Value<O>): this {
    this.flatfileRecord.set(key, value);

    return this;
  }

  /**
   * Get & set a field value at the same time.
   *
   * @param {string} key
   * @param {function} handler
   * @returns this
   */
  modify(key: Key<O>, handler: (value: Value<O>) => typeof value): this {
    const currentValue = this.flatfileRecord.get(key);
    this.flatfileRecord.set(key, handler(currentValue));

    return this;
  }

  /**
   * Add an info annotation to a cell/cells.
   *
   * @param {(string|string[])} key
   * @param {string} message
   */
  addInfo(key: Key<O>, message: string): this;
  addInfo(keys: Array<Key<O>>, message: string): this;
  addInfo(keys: unknown, message: string): this {
    if (G.isArray<Key<O>>(keys)) {
      const msg = new Message("info", message);

      keys.map((k) => this.flatfileRecord.addMessage(k, msg));
    } else {
      const msg = new Message("info", message);

      this.flatfileRecord.addMessage(keys as Key<O>, msg);
    }

    return this;
  }

  /**
   * Add an info annotation to a cell/cells.
   *
   * @param {(string|string[])} key
   * @param {string} message
   */
  addWarning(key: Key<O>, message: string): this;
  addWarning(keys: Array<Key<O>>, message: string): this;
  addWarning(keys: unknown, message: string): this {
    if (G.isArray<Key<O>>(keys)) {
      const msg = new Message("warn", message);

      keys.map((k) => this.flatfileRecord.addMessage(k, msg));
    } else {
      const msg = new Message("warn", message);

      this.flatfileRecord.addMessage(keys as Key<O>, msg);
    }

    return this;
  }

  /**
   * Add an error annotation to a cell/cells.
   *
   * @param {(string|string[])} key
   * @param {string} message
   */
  addError(key: Key<O>, message: string): this;
  addError(keys: Array<Key<O>>, message: string): this;
  addError(keys: unknown, message: string): this {
    if (G.isArray<Key<O>>(keys)) {
      const msg = new Message("error", message);

      keys.map((k) => this.flatfileRecord.addMessage(k, msg));
    } else {
      const msg = new Message("error", message);

      this.flatfileRecord.addMessage(keys as Key<O>, msg);
    }

    return this;
  }
}
