import { Builder } from "./builder";
import { Message } from "./message";

type Env = Record<string, unknown>;

class OptionField {
  private label: string;
  private description: string;
  private isRequired: boolean;
  private isVirtual: boolean;
  private isReadOnly: boolean;
  private isUnique: boolean;

  private value: Record<string, unknown>;
  private messages: Array<Message>;
  private env: Env;

  constructor() {
    this.label = "";
    this.description = "";
    this.isRequired = false;
    this.isVirtual = false;
    this.isReadOnly = false;
    this.isUnique = false;

    this.value = {};
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

  public setChoices(choices: Record<string, unknown>): void {
    this.value = choices;
  }

  public async setChoicesAsync(
    handler: (env: Env) => Promise<Record<string, unknown>>,
  ): Promise<void> {
    const choices = await handler(this.env);
    this.value = choices;
  }

  public getValue(): Record<string, unknown> {
    return this.value;
  }

  public getMessages(): Array<Message> {
    return this.messages;
  }
}

export class OptionFieldBuilder implements Builder {
  private optionField: OptionField;

  constructor() {
    this.optionField = new OptionField();
  }

  /**
   * Sets the value in the UI table the user will see.
   *
   * @param {string} label - column header
   * @returns this
   */
  withLabel(label: string): this {
    this.optionField.setLabel(label);

    return this;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description - visible on hover of column header
   * @returns this
   */
  withDescription(description: string): this {
    this.optionField.setDescription(description);

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   */
  withRequired(): this {
    this.optionField.setIsRequired();

    return this;
  }

  /**
   * Specifies the field is only visible during the review stage and makes it inherently a read-only field.
   *
   * @returns this
   */
  withVirtual(): this {
    this.optionField.setIsVirtual();

    return this;
  }

  /**
   * Ensures a user cannot edit the value.
   *
   * @returns this
   */
  withReadOnly(): this {
    this.optionField.setIsReadOnly();

    return this;
  }

  /**
   * Ensures a value is unique in the entire column.
   *
   * @returns this
   */
  withUnique(): this {
    this.optionField.setIsUnique();

    return this;
  }

  /**
   * Sets the choice synchronously.
   *
   * @param {Object} choices
   * @returns this
   */
  withChoices(choices: Record<string, unknown>): this {
    this.optionField.setChoices(choices);

    return this;
  }

  /**
   * Sets the choice asynchronously.
   *
   * @callback handler
   * @returns {Promise}
   * @returns this
   */
  withChoicesAsync(
    handler: (env: Env) => Promise<Record<string, unknown>>,
  ): this {
    this.optionField.setChoicesAsync(handler);

    return this;
  }
}
