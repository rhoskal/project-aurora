import { ArrayField } from "../field/arrayField";
import { DateField } from "../field/dateField";
import { NumberField } from "../field/numberField";
import { OptionField } from "../field/optionField";
import { TextField } from "../field/textField";
import * as G from "../helpers/typeGuards";
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
  private readonly computeFn?: (opts: {
    records: Array<FlatfileRecord>;
    env: Env;
    logger: Logger;
  }) => void;

  private _records: Array<FlatfileRecord>;
  private readonly _logger: Logger;

  constructor(params: {
    displayName: string;
    fields: Map<string, Field<T extends infer F ? F : never>>;
    computeFn?: (opts: {
      records: Array<FlatfileRecord>;
      env: Env;
      logger: Logger;
    }) => void;
  }) {
    // params
    this.displayName = params.displayName;
    this.fields = params.fields;
    this.computeFn = params.computeFn;

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
    if (G.isNotNil(this.computeFn)) {
      const newValue = this.computeFn({
        records: this._records,
        env: {},
        logger: this._logger,
      });

      // this.setValue(newValue);
    }
  }

  /**
   * Runs all sync and async operations.
   */
  public run(): void {
    this._runComputeFn();
  }
}

export class SheetBuilder<T = never> {
  private readonly displayName: string;
  // private fields: Map<string, Field<unknown>>;
  private fields: Map<string, Field<T extends infer F ? F : never>>;
  private computeFn?: (opts: {
    records: Array<FlatfileRecord>;
    env: Env;
    logger: Logger;
  }) => void;

  constructor(displayName: string) {
    this.displayName = displayName;
    this.fields = new Map();
  }

  /**
   * Adds a field to the Sheet.
   *
   * @param {string} key - internal key
   * @param {Field} field - field type class instantiation
   * @returns this
   */
  //   withField(key: string, field: Field<unknown>): this {
  //     this.fields = this.fields.set(key, field);
  //
  //     return this;
  //   }

  withField(key: string, field: Field<any>): this {
    this.fields = this.fields.set(key, field);

    return this;
  }

  /**
   * Run computations on all records in the Sheet.
   *
   * @returns this
   */
  withCompute(
    handler: (opts: {
      records: Array<FlatfileRecord>;
      env: Env;
      logger: Logger;
    }) => void,
  ): this {
    this.computeFn = handler;

    return this;
  }

  /**
   * Configure a custom action.
   *
   * @returns this
   */
  //   withAction(handler: (event: unknown) => void): this {
  //     this.sheet.addAction(handler);
  //
  //     return this;
  //   }

  /**
   * Final call to return an instantiated TextField.
   *
   * @returns TextField
   */
  build(): Sheet {
    if (this.fields.size === 0) {
      throw new Error("A Sheet must include at least one field.");
    }

    return new Sheet({
      displayName: this.displayName,
      fields: this.fields,
      computeFn: this.computeFn,
    });
  }
}
