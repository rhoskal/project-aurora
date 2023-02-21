import * as Eq from "fp-ts/Eq";
import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";

import * as G from "../helpers/typeGuards";
import { Builder } from "./builder";
import { Message } from "./message";

type Nullable<T> = null | T;
type Env = Record<string, unknown>;
type Cardinality = "has-one" | "has-many";

const eqMessage: Eq.Eq<Message> = {
  equals: (m1, m2) =>
    m1.getSeverity() === m2.getSeverity() &&
    m1.getContent() === m2.getContent(),
};

export class ReferenceField {
  private readonly label: string;
  private readonly description: string;
  private readonly isRequired: boolean;
  private readonly cardinality: Cardinality;

  private _value: O.Option<string>;
  private _messages: ReadonlyArray<Message>;
  private _env: Env;

  constructor(params: {
    label: string;
    description?: string;
    isRequired?: boolean;
    cardinality: Cardinality;
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
    this.cardinality = params.cardinality;

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

  /* Cardinality */

  public getCardinality(): Cardinality {
    return this.cardinality;
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
 * import { ReferenceFieldBuilder } from "@";
 *
 * const companyReference = new ReferenceFieldBuilder("Company Name")
 *   .withDescription("Tenant company name")
 *   .withCardinality("has-one")
 *   .build();
 *
 * @since 0.0.1
 */
export class ReferenceFieldBuilder implements Builder<ReferenceField> {
  private readonly label: string;
  private description?: string;
  private isRequired?: boolean;
  private cardinality?: Cardinality;

  /**
   * Creates a simple, empty ReferenceField.
   *
   * @param label
   * @param cardinality
   */
  constructor(label: string) {
    this.label = label;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param description - Visible on hover of column header.
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
   * Sets the cardinality.
   *
   * @param cardinality
   *
   * @returns this
   *
   * @since 0.0.1
   */
  withCardinality(cardinality: Cardinality): this {
    this.cardinality = cardinality;

    return this;
  }

  /**
   * Final call to return an instantiated ReferenceField.
   *
   * @returns ReferenceField
   *
   * @since 0.0.1
   */
  build(): never | ReferenceField {
    if (G.isUndefined(this.cardinality)) {
      throw new Error(
        "You must specify a cardinality with `withCardinality()`",
      );
    }

    return new ReferenceField({
      label: this.label,
      description: this.description,
      isRequired: this.isRequired,
      cardinality: this.cardinality,
    });
  }
}
