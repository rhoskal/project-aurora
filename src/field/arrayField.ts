import { Message } from "./message";

interface StageVisibility {
  mapping: boolean;
  review: boolean;
  export: boolean;
}

export class ArrayField<T> {
  private label: string;
  private description: string;
  private required: boolean;
  private visibility: StageVisibility;
  private readOnly: boolean;
  private unique: boolean;

  private value: Array<T>;
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

    this.value = [];
    this.messages = [];
  }

  /**
   * Sets the value in the UI table the user will see.
   *
   * @param {string} label - column header
   * @returns this
   */
  withLabel(label: string): this {
    this.label = label;

    return this;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description - visible on hover of column header
   * @returns this
   */
  withDescription(description: string) {
    this.description = description;

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   */
  withRequired() {
    this.required = true;

    return this;
  }

  /**
   * Change when a field is visible during the various import stages.
   *
   * @param {Object} opts - visibility options
   * @param {boolean} [opts.mapping=true] - show during the mapping stage
   * @param {boolean} [opts.review=true] - show during the review stage
   * @param {boolean} [opts.export=true] - show during the export stage
   * @returns this
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
   *
   * @returns this
   */
  withReadOnly() {
    this.readOnly = true;

    return this;
  }

  /**
   * Sets a default value when none was provided by the user.
   *
   * @param {Array} values
   * @returns this
   */
  withDefault(values: Array<T>) {
    this.value = this.value.concat(values);

    return this;
  }

  /**
   * Change the current value into something new.
   *
   * @callback handler
   * @param {(null|string)} value
   * @returns {string}
   * @returns this
   */
  withCompute(handler: (value: Array<T>) => Array<T>) {
    this.value = handler(this.value);

    return this;
  }

  /**
   * Validate the current value against certian conditions and display a message to the user when those conditions are not met.
   *
   * @callback handler
   * @param {(null|string)} value
   * @returns {(void|Message)}
   * @returns this
   */
  withValidate(handler: (value: Array<T>) => void | Message) {
    const msg = handler(this.value);

    if (msg) {
      this.messages.concat(msg);
    }

    return this;
  }
}
