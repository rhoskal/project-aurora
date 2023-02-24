import * as Eq from "fp-ts/Eq";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";

import { Message } from "../field/message";
import * as G from "../helpers/typeGuards";

type KeyOf<O> = keyof O;
type ValueOf<O> = O[keyof O];

const eqMessage: Eq.Eq<Message> = {
  equals: (m1, m2) =>
    m1.getSeverity() === m2.getSeverity() &&
    m1.getContent() === m2.getContent(),
};

export class FFRecord<O extends object = {}> {
  #value: O;
  #messages: ReadonlyArray<Message>;

  constructor(record: O) {
    this.#value = record;
    this.#messages = [];
  }

  get(key: KeyOf<O>): ValueOf<O> {
    return this.#value[key];
  }

  set(key: KeyOf<O>, value: ValueOf<O>): void {
    this.#value[key] = value;
  }

  public addMessage(key: KeyOf<O>, message: Message): void {
    this.#messages = pipe(
      this.#messages,
      RA.append(message),
      RA.uniq(eqMessage),
    );
  }

  public getMessages(): ReadonlyArray<Message> {
    return this.#messages;
  }
}

export interface FlatfileRecord<O extends object = {}> {
  get(key: KeyOf<O>): ValueOf<O>;
  set(key: KeyOf<O>, value: ValueOf<O>): this;
  modify(key: KeyOf<O>, handler: (value: ValueOf<O>) => typeof value): this;
  addInfo(key: KeyOf<O>, message: string): this;
  addInfo(keys: ReadonlyArray<KeyOf<O>>, message: string): this;
  addWarning(key: KeyOf<O>, message: string): this;
  addWarning(keys: ReadonlyArray<KeyOf<O>>, message: string): this;
  addError(key: KeyOf<O>, message: string): this;
  addError(keys: ReadonlyArray<KeyOf<O>>, message: string): this;
}

export class FlatfileRecordBuilder<O extends object>
  implements FlatfileRecord<O>
{
  #flatfileRecord: FFRecord<O>;

  constructor(record: O) {
    this.#flatfileRecord = new FFRecord<O>(record);
  }

  /**
   * Get a field value.
   *
   * @param {string} key
   * @returns unknown
   */
  get(key: KeyOf<O>): ValueOf<O> {
    return this.#flatfileRecord.get(key);
  }

  /**
   * Set a field value.
   *
   * @param {string} key
   * @param {(string|number|object)} value
   * @returns this
   */
  set(key: KeyOf<O>, value: ValueOf<O>): this {
    this.#flatfileRecord.set(key, value);

    return this;
  }

  /**
   * Get & set a field value at the same time.
   *
   * @param {string} key
   * @param {function} handler
   * @returns this
   */
  modify(key: KeyOf<O>, handler: (value: ValueOf<O>) => typeof value): this {
    const currentValue = this.#flatfileRecord.get(key);
    this.#flatfileRecord.set(key, handler(currentValue));

    return this;
  }

  /**
   * Add an info annotation to a cell/cells.
   *
   * @param {(string|string[])} key
   * @param {string} message
   */
  addInfo(key: KeyOf<O>, message: string): this;
  addInfo(keys: ReadonlyArray<KeyOf<O>>, message: string): this;
  addInfo(keys: unknown, message: string): this {
    if (G.isArray<KeyOf<O>>(keys)) {
      const msg = new Message("info", message);

      keys.map((k) => this.#flatfileRecord.addMessage(k, msg));
    } else {
      const msg = new Message("info", message);

      this.#flatfileRecord.addMessage(keys as KeyOf<O>, msg);
    }

    return this;
  }

  /**
   * Add an info annotation to a cell/cells.
   *
   * @param {(string|string[])} key
   * @param {string} message
   */
  addWarning(key: KeyOf<O>, message: string): this;
  addWarning(keys: ReadonlyArray<KeyOf<O>>, message: string): this;
  addWarning(keys: unknown, message: string): this {
    if (G.isArray<KeyOf<O>>(keys)) {
      const msg = new Message("warn", message);

      keys.map((k) => this.#flatfileRecord.addMessage(k, msg));
    } else {
      const msg = new Message("warn", message);

      this.#flatfileRecord.addMessage(keys as KeyOf<O>, msg);
    }

    return this;
  }

  /**
   * Add an error annotation to a cell/cells.
   *
   * @param {(string|string[])} key
   * @param {string} message
   */
  addError(key: KeyOf<O>, message: string): this;
  addError(keys: ReadonlyArray<KeyOf<O>>, message: string): this;
  addError(keys: unknown, message: string): this {
    if (G.isArray<KeyOf<O>>(keys)) {
      const msg = new Message("error", message);

      keys.map((k) => this.#flatfileRecord.addMessage(k, msg));
    } else {
      const msg = new Message("error", message);

      this.#flatfileRecord.addMessage(keys as KeyOf<O>, msg);
    }

    return this;
  }
}
