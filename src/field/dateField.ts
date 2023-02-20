import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe, constVoid } from "fp-ts/function";

import { Builder } from "./builder";
import { Message } from "./message";

type Nullable<T> = null | T;
type Env = Record<string, unknown>;

export class DateField {
  private readonly label: string;
  private readonly description: string;
  private readonly isRequired: boolean;
  private readonly isReadOnly: boolean;
  private readonly isUnique: boolean;
  private readonly defaultValue: O.Option<Date>;
  private readonly displayFormat: O.Option<string>;
  private readonly egressFormat: O.Option<string>;
  private readonly computeFn: O.Option<(value: Nullable<Date>) => Date>;
  private readonly validateFn: O.Option<
    (value: Nullable<Date>) => void | Message
  >;
  private readonly validateFnAsync: O.Option<
    (value: Nullable<Date>, env: Env) => Promise<void | Message>
  >;

  private _value: O.Option<Date>;
  private _messages: ReadonlyArray<Message>;
  private _env: Env;

  constructor(params: {
    label: string;
    description?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    isUnique?: boolean;
    defaultValue?: Nullable<Date>;
    displayFormat?: string;
    egressFormat?: string;
    computeFn?: (value: Nullable<Date>) => Date;
    validateFn?: (value: Nullable<Date>) => void | Message;
    validateFnAsync?: (
      value: Nullable<Date>,
      env: Env,
    ) => Promise<void | Message>;
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
    this.isReadOnly = pipe(
      O.fromNullable(params.isReadOnly),
      O.getOrElse(() => false),
    );
    this.isUnique = pipe(
      O.fromNullable(params.isUnique),
      O.getOrElse(() => false),
    );
    this.defaultValue = O.fromNullable(params.defaultValue);
    this.displayFormat = O.fromNullable(params.displayFormat);
    this.egressFormat = O.fromNullable(params.egressFormat);
    this.computeFn = O.fromNullable(params.computeFn);
    this.validateFn = O.fromNullable(params.validateFn);
    this.validateFnAsync = O.fromNullable(params.validateFnAsync);

    // internal
    this._value = O.none;
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

  /* Display Format */

  public getDisplayFormat(): Nullable<string> {
    return pipe(
      this.displayFormat,
      O.getOrElseW(() => null),
    );
  }

  /* Egress Format */

  public getEgressFormat(): Nullable<string> {
    return pipe(
      this.egressFormat,
      O.getOrElseW(() => null),
    );
  }

  /* Compute Fn */

  private _runComputeFn(): void {
    pipe(
      this.computeFn,
      O.match(constVoid, (computeFn) => {
        pipe(
          this._value,
          O.match(constVoid, (currentValue) => {
            const newValue = computeFn(currentValue);
            this.setValue(newValue);
          }),
        );
      }),
    );
  }

  /* Validate Fn */

  private _runValidateFn(): void {
    pipe(
      this.validateFn,
      O.match(constVoid, (validateFn) => {
        pipe(
          this._value,
          O.match(constVoid, (currentValue) => {
            const message = validateFn(currentValue);

            if (message) {
              this._addMessage(message);
            }
          }),
        );
      }),
    );
  }

  private async _runValidateAsync(): Promise<void> {
    pipe(
      this.validateFnAsync,
      O.match(constVoid, (validateFnAsync) => {
        pipe(
          this._value,
          O.match(constVoid, async (currentValue) => {
            const message = await validateFnAsync(currentValue, this._env);

            if (message) {
              this._addMessage(message);
            }
          }),
        );
      }),
    );
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

  public getValue(): Nullable<Date> {
    return pipe(
      this._value,
      O.getOrElse(() => {
        return pipe(
          this.defaultValue,
          O.getOrElseW(() => null),
        );
      }),
    );
  }

  public setValue(value: Date): void {
    this._value = O.some(value);
  }

  /* Messages */

  public getMessages(): ReadonlyArray<Message> {
    return this._messages;
  }

  private _addMessage(message: Message): void {
    this._messages = RA.append(message)(this._messages);
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
 * Builder class for a DateField.
 *
 * @example
 * const dob = new DateFieldBuilder("Date of Birth")
 *   .withDisplayFormat("dd/MM/yyyy")
 *   .withValidate((value) => {
 *     if (G.isNotNil(value) && value > new Date()) {
 *       return new Message("error", "dob cannot be in the future");
 *     }
 *   })
 *   .build();
 */
export class DateFieldBuilder implements Builder<DateField> {
  private readonly label: string;
  private description?: string;
  private isRequired?: boolean;
  private isReadOnly?: boolean;
  private isUnique?: boolean;
  private defaultValue?: Nullable<Date>;
  private displayFormat?: string;
  private egressFormat?: string;
  private computeFn?: (value: Nullable<Date>) => Date;
  private validateFn?: (value: Nullable<Date>) => void | Message;
  private validateFnAsync?: (
    value: Nullable<Date>,
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
  withDefault(value: Date): this {
    this.defaultValue = value;

    return this;
  }

  /**
   * Format the date in the UI table but not change the underlying Date type.
   *
   * @param {string} value - internal standard format string
   * @returns this
   */
  withDisplayFormat(value: string): this {
    this.displayFormat = value;

    return this;
  }

  /**
   * Format the date on data egress but not change the underlying Date type.
   *
   * @param {string} value - internal standard format string
   * @returns this
   */
  withEgressFormat(value: string): this {
    this.egressFormat = value;

    return this;
  }

  /**
   * Change the current value into something new.
   *
   * @callback handler
   * @returns this
   */
  withCompute(handler: (value: Nullable<Date>) => Date): this {
    this.computeFn = handler;

    return this;
  }

  /**
   * Validate the current value against certain conditions and display a message to the user when those conditions are not met.
   *
   * @callback handler
   * @returns this
   */
  withValidate(handler: (value: Nullable<Date>) => void | Message): this {
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
    handler: (value: Nullable<Date>, env: Env) => Promise<void | Message>,
  ): this {
    this.validateFnAsync = handler;

    return this;
  }

  /**
   * Final call to return an instantiated TextField.
   *
   * @returns DateField
   */
  build(): DateField {
    return new DateField({
      label: this.label,
      description: this.description,
      isRequired: this.isRequired,
      isUnique: this.isUnique,
      isReadOnly: this.isReadOnly,
      defaultValue: this.defaultValue,
      displayFormat: this.displayFormat,
      egressFormat: this.egressFormat,
      computeFn: this.computeFn,
      validateFn: this.validateFn,
      validateFnAsync: this.validateFnAsync,
    });
  }
}
