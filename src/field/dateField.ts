import { BaseField } from "./baseField";
import { Message } from "./message";

type Nullable<T> = null | T;

interface StageVisibility {
  mapping: boolean;
  review: boolean;
  export: boolean;
}

export class DateField extends BaseField {
  private label: string;
  private description: string;
  private required: boolean;
  private visibility: StageVisibility;
  private readOnly: boolean;
  private unique: boolean;
  private displayFormat: Nullable<string>;
  private egressFormat: Nullable<string>;

  private value: Nullable<Date>;
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
    this.displayFormat = null;
    this.egressFormat = null;

    this.value = null;
    this.messages = [];
  }

  withLabel(label: string): this {
    this.label = label;

    return this;
  }

  withDescription(description: string): this {
    this.description = description;

    return this;
  }

  withRequired(): this {
    this.required = true;

    return this;
  }

  withVisibility(opts: Partial<StageVisibility>): this {
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

  withReadOnly(): this {
    this.readOnly = true;

    return this;
  }

  withUnique(): this {
    this.unique = true;

    return this;
  }

  withDefault(value: Date): this {
    if (this.value === null) {
      this.value = value;
    }

    return this;
  }

  withOffset(value: number): this {
    return this;
  }

  /**
   * Format the date in the UI table but not change the underlying Date type.
   *
   * @params {string} value - internal standard format string
   * @returns this
   */
  withDisplayFormat(value: string): this {
    this.displayFormat = value;

    return this;
  }

  /**
   * Format the date on data egress but not change the underlying Date type.
   *
   * @params {string} value - internal standard format string
   * @returns this
   */
  withEgressFormat(value: string): this {
    this.egressFormat = value;

    return this;
  }

  withCompute(handler: (value: Nullable<Date>) => Date): this {
    this.value = handler(this.value);

    return this;
  }

  withValidate(handler: (value: Nullable<Date>) => void | Message): this {
    const msg = handler(this.value);

    if (msg) {
      this.messages.concat(msg);
    }

    return this;
  }
}
