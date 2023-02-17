import { Builder } from "./builder";
import { Message } from "./message";

type Nullable<T> = null | T;
type Env = Record<string, unknown>;

class TextField {
  private label: string;
  private description: string;
  private isRequired: boolean;
  private isVirtual: boolean;
  private isReadOnly: boolean;
  private isUnique: boolean;

  private value: Nullable<string>;
  private messages: Array<Message>;
  private env: Env;

  constructor() {
    this.label = "";
    this.description = "";
    this.isRequired = false;
    this.isVirtual = false;
    this.isReadOnly = false;
    this.isUnique = false;

    this.value = null; // should this be null | string? how to represent no value? We could return a custom type like a Maybe
    this.messages = [];
    this.env = {};
  }

  public setLabel(label: string): void {
    this.label = label;
  }

  public getLabel(): string {
    return this.label;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public getDescription(): string {
    return this.description;
  }

  public setIsRequired(): void {
    this.isRequired = true;
  }

  public getIsRequired(): boolean {
    return this.isRequired;
  }

  public setIsVirtual() {
    if (this.isRequired) {
      throw Error("Cannot hide a required field from mapping.");
    }

    this.isVirtual = true;
    this.isReadOnly = true;
  }

  public getIsVirtual(): boolean {
    return this.isVirtual;
  }

  public setIsReadOnly(): void {
    this.isReadOnly = true;
  }

  public getIsReadOnly(): boolean {
    return this.isReadOnly;
  }

  public setIsUnique(): void {
    this.isUnique = true;
  }

  public getIsUnique(): boolean {
    return this.isUnique;
  }

  public setDefaultValue(value: string): void {
    if (this.value === null) {
      this.value = value;
    }
  }

  public setComputeFn(handler: (value: Nullable<string>) => string): void {
    this.value = handler(this.value);
  }

  public setValidateFn(
    handler: (value: Nullable<string>) => void | Message,
  ): void {
    const msg = handler(this.value);

    if (msg) {
      this.messages.concat(msg);
    }
  }

  public async setValidateFnAsync(
    handler: (
      value: Nullable<string>,
      env: Env,
    ) => undefined | Promise<void | Message>,
  ): Promise<void> {
    const msg = await handler(this.value, this.env);

    if (msg) {
      this.messages.concat(msg);
    }
  }

  public getValue(): Nullable<string> {
    return this.value;
  }

  public getMessages(): Array<Message> {
    return this.messages;
  }

  public getEnv(): Env {
    return this.env;
  }
}

export class TextFieldBuilder implements Builder {
  private textField: TextField;

  constructor() {
    this.textField = new TextField();
  }

  /**
   * Sets the value in the UI table the user will see.
   *
   * @param {string} label - column header
   * @returns this
   */
  withLabel(label: string): this {
    this.textField.setLabel(label);

    return this;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description - visible on hover of column header
   * @returns this
   */
  withDescription(description: string): this {
    this.textField.setDescription(description);

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   */
  withRequired(): this {
    this.textField.setIsRequired();

    return this;
  }

  /**
   * Specifies the field is only visible during the review stage and makes it inherently a read-only field.
   *
   * @returns this
   */
  withVirtual(): this {
    this.textField.setIsVirtual();

    return this;
  }

  /**
   * Ensures a user cannot edit the value.
   *
   * @returns this
   */
  withReadOnly(): this {
    this.textField.setIsReadOnly();

    return this;
  }

  /**
   * Ensures a value is unique in the entire column.
   *
   * @returns this
   */
  withUnique(): this {
    this.textField.setIsUnique();

    return this;
  }

  /**
   * Sets a default value when none was provided by the user.
   *
   * @param value
   * @returns this
   */
  withDefault(value: string): this {
    this.textField.setDefaultValue(value);

    return this;
  }

  /**
   * Change the current value into something new.
   *
   * @callback handler
   * @returns this
   */
  withCompute(handler: (value: Nullable<string>) => string): this {
    this.textField.setComputeFn(handler);

    return this;
  }

  /**
   * Validate the current value against certian conditions and display a message to the user when those conditions are not met.
   *
   * @callback handler
   * @returns this
   */
  withValidate(handler: (value: Nullable<string>) => void | Message): this {
    this.textField.setValidateFn(handler);

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
    handler: (
      value: Nullable<string>,
      env: Env,
    ) => undefined | Promise<void | Message>,
  ): this {
    this.textField.setValidateFnAsync(handler);

    return this;
  }
}
