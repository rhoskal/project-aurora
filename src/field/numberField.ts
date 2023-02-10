import { Message } from "./message";

interface StageVisibility {
  mapping: boolean;
  review: boolean;
  export: boolean;
}

export class NumberField {
  private label: string;
  private description: string;
  private required: boolean;
  private visibility: StageVisibility;
  private readOnly: boolean;
  private unique: boolean;

  private value: null | number;
  private messages: Array<Message>;

  constructor() {
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

  /**
   * Sets the value in the UI table the user will see.
   *
   * @param {string} label
   */
  withLabel(label: string) {
    this.label = label;

    return this;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description
   */
  withDescription(description: string) {
    this.description = description;

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   */
  withRequired() {
    this.required = true;

    return this;
  }

  /**
   * Change when a field is visible during the various import stages.
   *
   * @param {Object} opts
   */
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

  /**
   * Ensures a user cannot edit the value.
   */
  withReadOnly() {
    this.readOnly = true;

    return this;
  }

  /**
   * Ensures a value is unique in the entire column.
   */
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

  withCompute(handler: (value: null | number) => number) {
    this.value = handler(this.value);

    return this;
  }

  withValidate(handler: (value: null | number) => void | Message) {
    const msg = handler(this.value);

    if (msg) {
      this.messages.concat(msg);
    }

    return this;
  }
}
