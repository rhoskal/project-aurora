import * as Eq from "fp-ts/Eq";
import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe, constVoid } from "fp-ts/function";

import * as G from "../helpers/typeGuards";
import { Builder } from "./builder";
import { Message } from "./message";

type Nullable<T> = null | T;
type Env = Record<string, unknown>;

const eqMessage: Eq.Eq<Message> = {
  equals: (m1, m2) =>
    m1.getSeverity() === m2.getSeverity() &&
    m1.getContent() === m2.getContent(),
};

export class OptionField {
  private readonly label: string;
  private readonly description: string;
  private readonly isRequired: boolean;
  private readonly choicesFnAsync: O.Option<
    (env: Env) => Promise<Record<string, unknown>>
  >;

  private _value: O.Option<string>;
  private _choices: Record<string, unknown>;
  private _messages: ReadonlyArray<Message>;
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
    this.description = pipe(
      O.fromNullable(params.description),
      O.getOrElse(() => ""),
    );
    this.isRequired = pipe(
      O.fromNullable(params.isRequired),
      O.getOrElse(() => false),
    );
    this.choicesFnAsync = O.fromNullable(params.choicesFnAsync);

    // internal
    this._value = O.none;
    this._choices = pipe(
      O.fromNullable(params.choices),
      O.getOrElse(() => ({})),
    );
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
    return this._choices;
  }

  private async _runChoicesAsync(): Promise<void> {
    pipe(
      this.choicesFnAsync,
      O.match(constVoid, async (choicesFnAsync) => {
        const choices = await choicesFnAsync(this._env);

        this._choices = choices;
      }),
    );
  }

  /**
   * Runs all sync and async operations.
   */
  public run(): void {
    this._runChoicesAsync();
  }

  /* Value */

  public getValue(): Nullable<string> {
    return pipe(
      this._value,
      O.getOrElseW(() => null),
    );
  }

  public setValue(value: string): void {
    this._value = O.some(value);
  }

  /* Messages */

  public getMessages(): ReadonlyArray<Message> {
    return this._messages;
  }

  private _addMessage(message: Message): void {
    this._messages = pipe(
      this._messages,
      RA.append(message),
      RA.uniq(eqMessage),
    );
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
 * import { OptionFieldBuilder } from "@";
 *
 * const state = new OptionFieldBuilder("State")
 *   .withChoices({
 *     colorado: "Colorado",
 *   })
 *   .build();
 *
 * @since 0.0.1
 */
export class OptionFieldBuilder implements Builder<OptionField> {
  private readonly label: string;
  private description?: string;
  private isRequired?: boolean;
  private choices?: Record<string, unknown>;
  private choicesFnAsync?: (env: Env) => Promise<Record<string, unknown>>;

  /**
   * Creates a simple, empty OptionField.
   *
   * @param label
   */
  constructor(label: string) {
    this.label = label;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description - Visible on hover of column header.
   *
   * @returns this
   *
   * @since 0.0.1
   */
  withDescription(description: string): this {
    this.description = description;

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   *
   * @since 0.0.1
   */
  withRequired(): this {
    this.isRequired = true;

    return this;
  }

  /**
   * Sets the choice synchronously.
   *
   * @param choices
   *
   * @returns this
   *
   * @since 0.0.1
   */
  withChoices(choices: Record<string, unknown>): this {
    this.choices = choices;

    return this;
  }

  /**
   * Sets the choice asynchronously.
   *
   * @callback handler
   *
   * @returns this
   *
   * @since 0.0.1
   */
  withChoicesAsync(
    handler: (env: Env) => Promise<Record<string, unknown>>,
  ): this {
    this.choicesFnAsync = handler;

    return this;
  }

  /**
   * Final call to return an instantiated OptionField.
   *
   * @returns OptionField
   *
   * @since 0.0.1
   */
  build(): never | OptionField {
    if (G.isUndefined(this.choices) && G.isUndefined(this.choicesFnAsync)) {
      throw Error(
        "Either `withChoices()` or `withChoicesAsync()` must be present.",
      );
    }

    if (G.isNotNil(this.choices) && G.isNotNil(this.choicesFnAsync)) {
      throw Error(
        "Please choose either `withChoices()` or `withChoicesAsync()` since both are present.",
      );
    }

    return new OptionField({
      label: this.label,
      description: this.description,
      isRequired: this.isRequired,
      choices: this.choices,
      choicesFnAsync: this.choicesFnAsync,
    });
  }
}
