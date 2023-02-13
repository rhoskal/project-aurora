import { Builder } from "./builder";
import { Message } from "./message";

type Nullable<T> = null | T;

class DateField {
  private label: string;
  private description: string;
  private isRequired: boolean;
  private isVirtual: boolean;
  private isReadOnly: boolean;
  private isUnique: boolean;
  private displayFormat: Nullable<string>;
  private egressFormat: Nullable<string>;

  private value: Nullable<Date>;
  private messages: Array<Message>;

  constructor() {
    this.label = "";
    this.description = "";
    this.isRequired = false;
    this.isVirtual = false;
    this.isReadOnly = false;
    this.isUnique = false;
    this.displayFormat = null;
    this.egressFormat = null;

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

  public setDefaultValue(value: Date): void {
    if (this.value === null) {
      this.value = value;
    }
  }

  // withOffset(value: number): this {
  //   return this;
  // }

  public setDisplayFormat(value: string): void {
    this.displayFormat = value;
  }

  public getDisplayFormat(): Nullable<string> {
    return this.displayFormat;
  }

  public setEgressFormat(value: string): void {
    this.egressFormat = value;
  }

  public getEgressFormat(): Nullable<string> {
    return this.egressFormat;
  }

  public setComputeFn(handler: (value: Nullable<Date>) => Date): void {
    this.value = handler(this.value);
  }

  public setValidateFn(
    handler: (value: Nullable<Date>) => void | Message,
  ): void {
    const msg = handler(this.value);

    if (msg) {
      this.messages.concat(msg);
    }
  }
}

export class DateFieldBuilder implements Builder {
  private dateField: DateField;

  constructor() {
    this.dateField = new DateField();
  }

  /**
   * Sets the value in the UI table the user will see.
   *
   * @param {string} label - column header
   * @returns this
   */
  withLabel(label: string): this {
    this.dateField.setLabel(label);

    return this;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description - visible on hover of column header
   * @returns this
   */
  withDescription(description: string): this {
    this.dateField.setDescription(description);

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   */
  withRequired(): this {
    this.dateField.setIsRequired();

    return this;
  }

  /**
   * Specifies the field is only visible during the review stage and makes it inherently a read-only field.
   *
   * @returns this
   */
  withVirtual(): this {
    this.dateField.setIsVirtual();

    return this;
  }

  /**
   * Ensures a user cannot edit the value.
   *
   * @returns this
   */
  withReadOnly(): this {
    this.dateField.setIsReadOnly();

    return this;
  }

  /**
   * Ensures a value is unique in the entire column.
   *
   * @returns this
   */
  withUnique(): this {
    this.dateField.setIsUnique();

    return this;
  }

  /**
   * Sets a default value when none was provided by the user.
   *
   * @param value
   * @returns this
   */
  withDefault(value: Date): this {
    this.dateField.setDefaultValue(value);

    return this;
  }

  /**
   * Format the date in the UI table but not change the underlying Date type.
   *
   * @params {string} value - internal standard format string
   * @returns this
   */
  withDisplayFormat(value: string): this {
    this.dateField.setDisplayFormat(value);

    return this;
  }

  /**
   * Format the date on data egress but not change the underlying Date type.
   *
   * @params {string} value - internal standard format string
   * @returns this
   */
  withEgressFormat(value: string): this {
    this.dateField.setEgressFormat(value);

    return this;
  }

  /**
   * Change the current value into something new.
   *
   * @callback handler
   * @returns this
   */
  withCompute(handler: (value: Nullable<Date>) => Date): this {
    this.dateField.setComputeFn(handler);

    return this;
  }

  /**
   * Validate the current value against certian conditions and display a message to the user when those conditions are not met.
   *
   * @callback handler
   * @returns this
   */
  withValidate(handler: (value: Nullable<Date>) => void | Message): this {
    this.dateField.setValidateFn(handler);

    return this;
  }
}
