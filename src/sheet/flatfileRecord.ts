import * as G from "../helpers/typeGuards";

export interface FlatfileRecord {
  get(key: string): unknown;
  set(key: string, value: string | number | object): this;
  modify(key: string, handler: (value: unknown) => typeof value): this;
  addInfo(key: string, message: string): this;
  addInfo(keys: Array<string>, message: string): this;
  addWarning(key: string, message: string): this;
  addWarning(keys: Array<string>, message: string): this;
  addError(key: string, message: string): this;
  addError(keys: Array<string>, message: string): this;
}

export class DataRecord implements FlatfileRecord {
  private value: Record<string, unknown>;

  constructor(record: Record<string, unknown>) {
    this.value = record;
  }

  /**
   * Get a field value.
   *
   * @param {string} key
   * @returns unknown
   */
  get(key: string) {
    return this.value[key];
  }

  /**
   * Set a field value.
   *
   * @param {string} key
   * @param {(string|number|object)} value
   * @returns this
   */
  set(key: string, value: unknown) {
    this.value[key] = value;

    return this;
  }

  /**
   * Get & set a field value at the same time.
   *
   * @param {string} key
   * @param {function} handler
   * @returns this
   */
  modify(key: string, handler: (value: unknown) => typeof value): this {
    const currentValue = this.value[key];
    this.value[key] = handler(currentValue);

    return this;
  }

  /**
   * Add an info annotation to a cell/cells.
   *
   * @param {(string|string[])} key
   * @param {string} message
   */
  addInfo(key: string, message: string): this;
  addInfo(keys: Array<string>, message: string): this;
  addInfo(key: unknown, message: string): this {
    if (G.isString(key)) {
      // do something
    } else {
      // do something
    }

    return this;
  }

  /**
   * Add an info annotation to a cell/cells.
   *
   * @param {(string|string[])} key
   * @param {string} message
   */
  addWarning(key: string, message: string): this;
  addWarning(keys: Array<string>, message: string): this;
  addWarning(key: unknown, message: string): this {
    if (G.isString(key)) {
      // do something
    } else {
      // do something
    }

    return this;
  }

  /**
   * Add an error annotation to a cell/cells.
   *
   * @param {(string|string[])} key
   * @param {string} message
   */
  addError(key: string, message: string): this;
  addError(keys: Array<string>, message: string): this;
  addError(key: unknown, message: string): this {
    if (G.isString(key)) {
      // do something
    } else {
      // do something
    }

    return this;
  }
}
