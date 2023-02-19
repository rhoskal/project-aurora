import { Builder } from "./builder";
import * as G from "../helpers/typeGuards";
import { Message } from "./message";

type Nullable<T> = null | T;
type Env = Record<string, unknown>;

export class TextField {
  private readonly label: string;
  private readonly description: string;
  private readonly isRequired: boolean;
  private readonly isReadOnly: boolean;
  private readonly isUnique: boolean;
  private readonly defaultValue: Nullable<string>;
  private readonly computeFn?: (value: Nullable<string>) => string;
  private readonly validateFn?: (value: Nullable<string>) => void | Message;
  private readonly validateFnAsync?: (
    value: Nullable<string>,
    env: Env,
  ) => Promise<void | Message>;

  private _value: Nullable<string>;
  private _messages: Array<Message>;
  private _env: Env;

  constructor(params: {
    label: string;
    description?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    isUnique?: boolean;
    defaultValue?: Nullable<string>;
    computeFn?: (value: Nullable<string>) => string;
    validateFn?: (value: Nullable<string>) => void | Message;
    validateFnAsync?: (
      value: Nullable<string>,
      env: Env,
    ) => Promise<void | Message>;
  }) {
    // params
    this.label = params.label;
    this.description = G.isUndefined(params.description)
      ? ""
      : params.description;
    this.isRequired = G.isUndefined(params.isRequired)
      ? false
      : params.isRequired;
    this.isReadOnly = G.isUndefined(params.isReadOnly)
      ? false
      : params.isReadOnly;
    this.isUnique = G.isUndefined(params.isUnique) ? false : params.isUnique;
    this.defaultValue = G.isUndefined(params.defaultValue)
      ? null
      : params.defaultValue;
    this.computeFn = params.computeFn;
    this.validateFn = params.validateFn;
    this.validateFnAsync = params.validateFnAsync;

    // internal
    this._value = null;
    this._messages = [];
    this._env = {};
  }

  /* Label */

  public getLabel(): string {
    return this.label;
  }

  /* Description */

  public getDescription(): string {
    return this.description;
  }

  /* Required */

  public getIsRequired(): boolean {
    return this.isRequired;
  }

  /* ReadOnly */

  public getIsReadOnly(): boolean {
    return this.isReadOnly;
  }

  /* Unique */

  public getIsUnique(): boolean {
    return this.isUnique;
  }

  /* Compute Fn */

  private _runComputeFn(): void {
    if (G.isNotNil(this.computeFn)) {
      const newValue = this.computeFn(this._value);
      this.setValue(newValue);
    }
  }

  /* Validate Fn */

  private _runValidateFn(): void {
    if (G.isNotNil(this.validateFn)) {
      const message = this.validateFn(this._value);

      if (message) {
        this._addMessage(message);
      }
    }
  }

  private async _runValidateAsync(): Promise<void> {
    if (G.isNotNil(this.validateFnAsync)) {
      const message = await this.validateFnAsync(this._value, this._env);

      if (message) {
        this._addMessage(message);
      }
    }
  }

  /**
   * Runs all sync and async operations.
   */
  public run(): void {
    this._runComputeFn();
    this._runValidateFn();
    this._runValidateAsync();
  }

  /* Value */

  public getValue(): Nullable<string> {
    if (G.isNull(this._value) && G.isNotNil(this.defaultValue)) {
      return this.defaultValue;
    } else {
      return this._value;
    }
  }

  public setValue(value: string): void {
    this._value = value;
  }

  /* Messages */

  public getMessages(): Array<Message> {
    return this._messages;
  }

  private _addMessage(message: Message): void {
    this._messages = this._messages.concat(message);
  }

  /* Env */

  public getEnv(): Env {
    return this._env;
  }

  public setEnv(env: Env): void {
    this._env = env;
  }
}

/**
 * Builder class for a TextField.
 *
 * @example
 * const firstName = new TextFieldBuilder("First Name")
 *   .withDescription("Legal first name")
 *   .build();
 */
export class TextFieldBuilder implements Builder<TextField> {
  private readonly label: string;
  private description?: string;
  private isRequired?: boolean;
  private isReadOnly?: boolean;
  private isUnique?: boolean;
  private defaultValue?: Nullable<string>;
  private computeFn?: (value: Nullable<string>) => string;
  private validateFn?: (value: Nullable<string>) => void | Message;
  private validateFnAsync?: (
    value: Nullable<string>,
    env: Env,
  ) => Promise<void | Message>;

  constructor(label: string) {
    this.label = label;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description - visible on hover of column header
   * @returns this
   */
  withDescription(description: string): this {
    this.description = description;

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   */
  withRequired(): this {
    this.isRequired = true;

    return this;
  }

  /**
   * Ensures a user cannot edit the value.
   *
   * @returns this
   */
  withReadOnly(): this {
    this.isReadOnly = true;

    return this;
  }

  /**
   * Ensures a value is unique in the entire column.
   *
   * @returns this
   */
  withUnique(): this {
    this.isUnique = true;

    return this;
  }

  /**
   * Sets a default value when none was provided by the user.
   *
   * @param value
   * @returns this
   */
  withDefault(value: string): this {
    this.defaultValue = value;

    return this;
  }

  /**
   * Change the current value into something new.
   *
   * @callback handler
   * @returns this
   */
  withCompute(handler: (value: Nullable<string>) => string): this {
    this.computeFn = handler;

    return this;
  }

  /**
   * Validate the current value against certain conditions and display a message to the user when those conditions are not met.
   *
   * @callback handler
   * @returns this
   */
  withValidate(handler: (value: Nullable<string>) => void | Message): this {
    this.validateFn = handler;

    return this;
  }

  /**
   * Sets the value asynchronously.
   *
   * @callback handler
   * @returns {Promise}
   * @returns this
   */
  withValidateAsync(
    handler: (value: Nullable<string>, env: Env) => Promise<void | Message>,
  ): this {
    this.validateFnAsync = handler;

    return this;
  }

  /**
   * Final call to return an instantiated TextField.
   *
   * @returns TextField
   */
  build(): TextField {
    return new TextField({
      label: this.label,
      description: this.description,
      isRequired: this.isRequired,
      isUnique: this.isUnique,
      isReadOnly: this.isReadOnly,
      defaultValue: this.defaultValue,
      computeFn: this.computeFn,
      validateFn: this.validateFn,
      validateFnAsync: this.validateFnAsync,
    });
  }
}
