import { Builder } from "./builder";
import * as G from "../helpers/typeGuards";
import { Message } from "./message";

type Nullable<T> = null | T;
type Env = Record<string, unknown>;

export class OptionField {
  private readonly label: string;
  private readonly description: string;
  private readonly isRequired: boolean;
  private choices: Record<string, unknown>;
  private readonly choicesFnAsync?: (
    env: Env,
  ) => Promise<Record<string, unknown>>;

  private _value: Nullable<string>;
  private _messages: Array<Message>;
  private _env: Env;

  constructor(params: {
    label: string;
    description?: string;
    isRequired?: boolean;
    choices?: Record<string, unknown>;
    choicesFnAsync?: (env: Env) => Promise<Record<string, unknown>>;
  }) {
    // params
    this.label = params.label;
    this.description = G.isUndefined(params.description)
      ? ""
      : params.description;
    this.isRequired = G.isUndefined(params.isRequired)
      ? false
      : params.isRequired;
    this.choices = G.isUndefined(params.choices) ? {} : params.choices;
    this.choicesFnAsync = params.choicesFnAsync;

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

  /* Choices Fn */

  public getChoices(): Record<string, unknown> {
    return this.choices;
  }

  private async _runChoicesAsync(): Promise<void> {
    if (G.isNotNil(this.choicesFnAsync)) {
      const choices = await this.choicesFnAsync(this._env);
      this.choices = choices;
    }
  }

  /**
   * Runs all sync and async operations.
   */
  public run(): void {
    this._runChoicesAsync();
  }

  /* Value */

  public getValue(): Nullable<string> {
    return this._value;
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
 * Builder class for a OptionField.
 *
 * @example
 * const state = new OptionFieldBuilder("State")
 *   .withChoices({
 *     colorado: "Colorado",
 *   })
 *   .build();
 */
export class OptionFieldBuilder implements Builder<OptionField> {
  private readonly label: string;
  private description?: string;
  private isRequired?: boolean;
  private choices?: Record<string, unknown>;
  private choicesFnAsync?: (env: Env) => Promise<Record<string, unknown>>;

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
   * Sets the choice synchronously.
   *
   * @param {Object} choices
   * @returns this
   */
  withChoices(choices: Record<string, unknown>): this {
    this.choices = choices;

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
    this.choicesFnAsync = handler;

    return this;
  }

  /**
   * Final call to return an instantiated TextField.
   *
   * @returns TextField
   */
  build(): OptionField {
    return new OptionField({
      label: this.label,
      description: this.description,
      isRequired: this.isRequired,
      choices: this.choices,
      choicesFnAsync: this.choicesFnAsync,
    });
  }
}
