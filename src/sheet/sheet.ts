import { ArrayField } from "../field/arrayField";
import { DateField } from "../field/dateField";
import { NumberField } from "../field/numberField";
import { OptionField } from "../field/optionField";
import { TextField } from "../field/textField";

type Field<T> =
  | TextField
  | NumberField
  | OptionField
  | DateField
  | ArrayField<T>;

interface FlatfileRecord {}

export class Sheet {
  private name: string;
  private records: Array<FlatfileRecord>;
  private fields: Array<[key: string, field: Field<unknown>]>;

  constructor(name: string) {
    this.name = name;
    this.records = [];
    this.fields = [];
  }

  /**
   * Adds a field to the Sheet.
   *
   * @params {string} key - internal key
   * @params {Field} field - field type class instantiation
   * @returns this
   */
  withField(key: string, field: Field<unknown>): this {
    this.fields.concat([key, field]);

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
    handler({ records: this.records, session: {}, logger: {} });

    return this;
  }

  /**
   * Configure a custom action.
   *
   * @returns this
   */
  withAction(handler: (event: unknown) => void): this {
    handler(null);

    return this;
  }
}
