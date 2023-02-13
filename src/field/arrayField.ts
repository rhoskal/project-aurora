import { Builder } from "./builder";
import { Message } from "./message";

class ArrayField<T> {
  private label: string;
  private description: string;
  private isRequired: boolean;
  private isVirtual: boolean;
  private isReadOnly: boolean;
  private isUnique: boolean;

  private value: Array<T>;
  private messages: Array<Message>;

  constructor() {
    this.label = "";
    this.description = "";
    this.isRequired = false;
    this.isVirtual = false;
    this.isReadOnly = false;
    this.isUnique = false;

    this.value = [];
    this.messages = [];
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

  public setDefaultValue(value: Array<T>): void {
    if (this.value === null) {
      this.value = value;
    }
  }

  public setComputeFn(handler: (value: Array<T>) => Array<T>): void {
    this.value = handler(this.value);
  }

  public setValidateFn(handler: (value: Array<T>) => void | Message): void {
    const msg = handler(this.value);

    if (msg) {
      this.messages.concat(msg);
    }
  }

  public getValue(): Array<T> {
    return this.value;
  }

  public getMessages(): Array<Message> {
    return this.messages;
  }
}

export class ArrayFieldBuilder<T> implements Builder {
  private arrayField: ArrayField<T>;

  constructor() {
    this.arrayField = new ArrayField<T>();
  }

  /**
   * Sets the value in the UI table the user will see.
   *
   * @param {string} label - column header
   * @returns this
   */
  withLabel(label: string): this {
    this.arrayField.setLabel(label);

    return this;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description - visible on hover of column header
   * @returns this
   */
  withDescription(description: string): this {
    this.arrayField.setDescription(description);

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   */
  withRequired(): this {
    this.arrayField.setIsRequired();

    return this;
  }

  /**
   * Specifies the field is only visible during the review stage and makes it inherently a read-only field.
   *
   * @returns this
   */
  withVirtual(): this {
    this.arrayField.setIsVirtual();

    return this;
  }

  /**
   * Ensures a user cannot edit the value.
   *
   * @returns this
   */
  withReadOnly(): this {
    this.arrayField.setIsReadOnly();

    return this;
  }

  /**
   * Ensures a value is unique in the entire column.
   *
   * @returns this
   */
  withUnique(): this {
    this.arrayField.setIsUnique();

    return this;
  }

  /**
   * Sets a default value when none was provided by the user.
   *
   * @param value
   * @returns this
   */
  withDefault(value: Array<T>): this {
    this.arrayField.setDefaultValue(value);

    return this;
  }

  /**
   * Change the current value into something new.
   *
   * @callback handler
   * @returns this
   */
  withCompute(handler: (value: Array<T>) => Array<T>): this {
    this.arrayField.setComputeFn(handler);

    return this;
  }

  /**
   * Validate the current value against certian conditions and display a message to the user when those conditions are not met.
   *
   * @callback handler
   * @returns this
   */
  withValidate(handler: (value: Array<T>) => void | Message): this {
    this.arrayField.setValidateFn(handler);

    return this;
  }
}
