import { BaseField } from "./baseField";
import { Message } from "./message";

type Nullable<T> = null | T;

interface StageVisibility {
  mapping: boolean;
  review: boolean;
  export: boolean;
}

export class NumberField extends BaseField {
  private label: string;
  private description: string;
  private required: boolean;
  private visibility: StageVisibility;
  private readOnly: boolean;
  private unique: boolean;

  private value: Nullable<number>;
  private messages: Array<Message>;

  constructor() {
    super();

    this.label = "";
    this.description = "";
    this.required = false;
    this.visibility = {
      mapping: true,
      review: true,
      export: true,
    };
    this.readOnly = false;
    this.unique = false;

    this.value = null;
    this.messages = [];
  }

  withLabel(label: string) {
    this.label = label;

    return this;
  }

  withDescription(description: string) {
    this.description = description;

    return this;
  }

  withRequired() {
    this.required = true;

    return this;
  }

  withVisibility(opts: Partial<StageVisibility>) {
    if (opts.mapping === false && this.required) {
      throw Error("Cannot hide a required field from mapping.");
    }

    if (
      opts.mapping === false &&
      opts.review === false &&
      opts.export === false
    ) {
      throw Error("Cannot hide a field from every stage.");
    }

    this.visibility = {
      ...this.visibility,
      ...opts,
    };

    return this;
  }

  withReadOnly() {
    this.readOnly = true;

    return this;
  }

  withUnique() {
    this.unique = true;

    return this;
  }

  withDefault(value: number) {
    if (this.value === null) {
      this.value = value;
    }

    return this;
  }

  withCompute(handler: (value: Nullable<number>) => number) {
    this.value = handler(this.value);

    return this;
  }

  withValidate(handler: (value: Nullable<number>) => void | Message) {
    const msg = handler(this.value);

    if (msg) {
      this.messages.concat(msg);
    }

    return this;
  }
}
