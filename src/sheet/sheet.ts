import * as O from "fp-ts/Option";
import { pipe, constVoid } from "fp-ts/function";

import { ArrayField } from "../field/arrayField";
import { DateField } from "../field/dateField";
import { NumberField } from "../field/numberField";
import { OptionField } from "../field/optionField";
import { TextField } from "../field/textField";
import { FlatfileRecord } from "./flatfileRecord";
import { Logger } from "./logger";

type Field<T> =
  | TextField
  | NumberField
  | OptionField
  | DateField
  | ArrayField<T>;

interface Env {}

export class Sheet<T = never> {
  private readonly displayName: string;
  private readonly fields: Map<string, Field<T extends infer F ? F : never>>;
  private readonly computeFn: O.Option<
    (opts: {
      records: ReadonlyArray<FlatfileRecord>;
      env: Env;
      logger: Logger;
    }) => void
  >;

  private _records: ReadonlyArray<FlatfileRecord>;
  private readonly _logger: Logger;

  constructor(params: {
    displayName: string;
    fields: Map<string, Field<T extends infer F ? F : never>>;
    computeFn?: (opts: {
      records: ReadonlyArray<FlatfileRecord>;
      env: Env;
      logger: Logger;
    }) => void;
  }) {
    // params
    this.displayName = params.displayName;
    this.fields = params.fields;
    this.computeFn = O.fromNullable(params.computeFn);

    // internal
    this._records = [];
    this._logger = new Logger();
  }

  /* DisplayName */

  public getDisplayName(): string {
    return this.displayName;
  }

  /* Compute Fn */

  private _runComputeFn(): void {
    pipe(
      this.computeFn,
      O.match(constVoid, (computeFn) => {
        const newRecords = computeFn({
          records: this._records,
          env: {},
          logger: this._logger,
        });
      }),
    );
  }

  /**
   * Runs all sync and async operations.
   */
  public run(): void {
    this._runComputeFn();
  }
}

/**
 * Builder class for a Sheet.
 *
 * @example
 * import { TextFieldBuilder, SheetBuilder } from "@";
 *
 * const textField = new TextFieldBuilder("Foo").build();
 * const sheet = new SheetBuilder("Bar").withField("foo", textField).build();
 *
 * @since 0.0.1
 */
export class SheetBuilder<T = never> {
  readonly #displayName: string;
  #fields: Map<string, Field<T extends infer F ? F : never>>;
  #computeFn?: (opts: {
    records: ReadonlyArray<FlatfileRecord>;
    env: Env;
    logger: Logger;
  }) => void;

  /**
   * Creates a simple, empty Sheet.
   *
   * @param label
   */
  constructor(displayName: string) {
    this.#displayName = displayName;
    this.#fields = new Map();
  }

  /**
   * Adds a field to the Sheet.
   *
   * @param key - internal key
   * @param field - field type class instantiation
   *
   * @returns this
   *
   * @since 0.0.1
   */
  withField(key: string, field: Field<any>): this {
    this.#fields = this.#fields.set(key, field);

    return this;
  }

  /**
   * Run computations on all records in the Sheet.
   *
   * @param handler
   *
   * @returns this
   *
   * @since 0.0.1
   */
  withCompute(
    handler: (opts: {
      records: ReadonlyArray<FlatfileRecord>;
      env: Env;
      logger: Logger;
    }) => void,
  ): this {
    this.#computeFn = handler;

    return this;
  }

  /**
   * Configure a custom action.
   *
   * @param handler
   *
   * @returns this
   *
   * @since 0.0.1
   */
  withAction(handler: (event: unknown) => void): this {
    // this.sheet.addAction(handler);

    return this;
  }

  /**
   * Final call to return an instantiated Sheet.
   *
   * @returns Sheet
   *
   * @since 0.0.1
   */
  build(): never | Sheet {
    if (this.#fields.size === 0) {
      throw new Error("A Sheet must include at least one field.");
    }

    return new Sheet({
      displayName: this.#displayName,
      fields: this.#fields,
      computeFn: this.#computeFn,
    });
  }
}
