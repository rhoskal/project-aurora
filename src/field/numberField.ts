import { Builder } from "./builder";
import { Message } from "./message";

type Nullable<T> = null | T;

class NumberField {
  private label: string;
  private description: string;
  private isRequired: boolean;
  private isVirtual: boolean;
  private isReadOnly: boolean;
  private isUnique: boolean;

  private value: Nullable<number>;
  private messages: Array<Message>;

  constructor() {
    this.label = "";
    this.description = "";
    this.isRequired = false;
    this.isVirtual = false;
    this.isReadOnly = false;
    this.isUnique = false;

    this.value = null;
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

  public setDefaultValue(value: number): void {
    if (this.value === null) {
      this.value = value;
    }
  }

  public setComputeFn(handler: (value: Nullable<number>) => number): void {
    this.value = handler(this.value);
  }

  public setValidateFn(
    handler: (value: Nullable<number>) => void | Message,
  ): void {
    const msg = handler(this.value);

    if (msg) {
      this.messages.concat(msg);
    }
  }

  public getValue(): Nullable<number> {
    return this.value;
  }

  public getMessages(): Array<Message> {
    return this.messages;
  }
}

export class NumberFieldBuilder implements Builder {
  private numberField: NumberField;

  constructor() {
    this.numberField = new NumberField();
  }

  /**
   * Sets the value in the UI table the user will see.
   *
   * @param {string} label - column header
   * @returns this
   */
  withLabel(label: string): this {
    this.numberField.setLabel(label);

    return this;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description - visible on hover of column header
   * @returns this
   */
  withDescription(description: string): this {
    this.numberField.setDescription(description);

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   */
  withRequired(): this {
    this.numberField.setIsRequired();

    return this;
  }

  /**
   * Specifies the field is only visible during the review stage and makes it inherently a read-only field.
   *
   * @returns this
   */
  withVirtual(): this {
    this.numberField.setIsVirtual();

    return this;
  }

  /**
   * Ensures a user cannot edit the value.
   *
   * @returns this
   */
  withReadOnly(): this {
    this.numberField.setIsReadOnly();

    return this;
  }

  /**
   * Ensures a value is unique in the entire column.
   *
   * @returns this
   */
  withUnique(): this {
    this.numberField.setIsUnique();

    return this;
  }

  /**
   * Sets a default value when none was provided by the user.
   *
   * @param value
   * @returns this
   */
  withDefault(value: number): this {
    this.numberField.setDefaultValue(value);

    return this;
  }

  /**
   * Change the current value into something new.
   *
   * @callback handler
   * @returns this
   */
  withCompute(handler: (value: Nullable<number>) => number): this {
    this.numberField.setComputeFn(handler);

    return this;
  }

  /**
   * Validate the current value against certian conditions and display a message to the user when those conditions are not met.
   *
   * @callback handler
   * @returns this
   */
  withValidate(handler: (value: Nullable<number>) => void | Message): this {
    this.numberField.setValidateFn(handler);

    return this;
  }
}
