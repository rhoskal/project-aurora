import { ArrayFieldBuilder as ArrayField } from "../field/arrayField";
import { DateFieldBuilder as DateField } from "../field/dateField";
import { NumberFieldBuilder as NumberField } from "../field/numberField";
import { OptionFieldBuilder as OptionField } from "../field/optionField";
import { TextFieldBuilder as TextField } from "../field/textField";

type Field<T> =
  | TextField
  | NumberField
  | OptionField
  | DateField
  | ArrayField<T>;

interface FlatfileRecord {}

class Sheet {
  private readonly name: string;
  private records: Array<FlatfileRecord>;
  private fields: Array<[key: string, field: Field<unknown>]>;

  constructor(name: string) {
    this.name = name;
    this.records = [];
    this.fields = [];
  }

  public getName(): string {
    return this.name;
  }

  public addField(key: string, field: Field<unknown>): void {
    this.fields.concat([key, field]);
  }

  public setComputeFn(
    handler: (opts: {
      records: Array<FlatfileRecord>;
      session: {};
      logger: {};
    }) => void,
  ): void {
    handler({ records: this.records, session: {}, logger: {} });
  }

  public addAction(handler: (event: unknown) => void): void {
    handler(null);
  }
}

export class SheetBuilder {
  private sheet: Sheet;

  constructor(name: string) {
    this.sheet = new Sheet(name);
  }

  /**
   * Adds a field to the Sheet.
   *
   * @params {string} key - internal key
   * @params {Field} field - field type class instantiation
   * @returns this
   */
  withField(key: string, field: Field<unknown>): this {
    this.sheet.addField(key, field);

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
      session: {};
      logger: {};
    }) => void,
  ): this {
    this.sheet.setComputeFn(handler);

    return this;
  }

  /**
   * Configure a custom action.
   *
   * @returns this
   */
  withAction(handler: (event: unknown) => void): this {
    this.sheet.addAction(handler);

    return this;
  }
}
