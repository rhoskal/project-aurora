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

type EventTopic =
  | "action:triggered"
  | "file:deleted"
  | "job:completed"
  | "job:deleted"
  | "job:failed"
  | "job:started"
  | "job:updated"
  | "job:waiting"
  | "records:created"
  | "records:deleted"
  | "records:updated"
  | "sheet:validated"
  | "space:added"
  | "space:removed"
  | "upload:completed"
  | "upload:failed"
  | "upload:started"
  | "user:added"
  | "user:offline"
  | "user:online"
  | "user:removed"
  | "workbook:added"
  | "workbook:removed";

export class Sheet<T = never> {
  readonly #displayName: string;
  readonly #fields: Map<string, Field<T extends infer F ? F : never>>;
  readonly #computeFn: O.Option<
    (opts: {
      records: ReadonlyArray<FlatfileRecord>;
      env: Env;
      logger: Logger;
    }) => void
  >;

  #records: ReadonlyArray<FlatfileRecord>;
  readonly #logger: Logger;

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
    this.#displayName = params.displayName;
    this.#fields = params.fields;
    this.#computeFn = O.fromNullable(params.computeFn);

    // internal
    this.#records = [];
    this.#logger = new Logger();
  }

  /* DisplayName */

  public getDisplayName(): string {
    return this.#displayName;
  }

  /* Compute Fn */

  private _runComputeFn(): void {
    pipe(
      this.#computeFn,
      O.match(constVoid, (computeFn) => {
        const newRecords = computeFn({
          records: this.#records,
          env: {},
          logger: this.#logger,
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
  withAction(
    topics: ReadonlyArray<EventTopic>,
    handler: (event: unknown) => void,
  ): this {
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
