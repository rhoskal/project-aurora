import { DateField } from "../field/dateField";
import { NumberField } from "../field/numberField";
import { OptionField } from "../field/optionField";
import { TextField } from "../field/textField";

type Field = TextField | NumberField | OptionField | DateField;

interface FlatfileRecord {}

export class Sheet {
  private name: string;
  private records: Array<FlatfileRecord>;
  private fields: Array<[key: string, field: Field]>;

  constructor(name: string) {
    this.name = name;
    this.records = [];
    this.fields = [];
  }

  withField(key: string, field: Field) {
    this.fields.concat([key, field]);

    return this;
  }

  withCompute(
    handler: (opts: {
      records: Array<FlatfileRecord>;
      session: {};
      logger: {};
    }) => void,
  ) {
    handler({ records: this.records, session: {}, logger: {} });

    return this;
  }

  withAction() {
    return this;
  }
}
