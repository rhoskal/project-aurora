import * as Eq from "fp-ts/Eq";
import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";

import { Builder } from "./builder";
import { Message } from "./message";

type Nullable<T> = null | T;
type Env = Record<string, unknown>;

const eqMessage: Eq.Eq<Message> = {
  equals: (m1, m2) =>
    m1.getSeverity() === m2.getSeverity() &&
    m1.getContent() === m2.getContent(),
};

export class ReferenceField {
  private readonly label: string;
  private readonly description: string;
  private readonly isRequired: boolean;

  private _value: O.Option<string>;
  private _messages: ReadonlyArray<Message>;
  private _env: Env;

  constructor(params: {
    label: string;
    description?: string;
    isRequired?: boolean;
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
 * Builder class for a ReferenceField.
 *
 * @example
 * const companyReference = new ReferenceFieldBuilder("Company Name")
 *   .withDescription("Tenant company name")
 *   .build();
 */
export class ReferenceFieldBuilder implements Builder<ReferenceField> {
  private readonly label: string;
  private description?: string;
  private isRequired?: boolean;

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
   * Final call to return an instantiated TextField.
   *
   * @returns TextField
   */
  build(): ReferenceField {
    return new ReferenceField({
      label: this.label,
      description: this.description,
      isRequired: this.isRequired,
    });
  }
}
