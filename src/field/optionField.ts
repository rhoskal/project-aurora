import { Message } from "./message";

interface StageVisibility {
  mapping: boolean;
  review: boolean;
  export: boolean;
}

export class OptionField {
  private label: string;
  private description: string;
  private required: boolean;
  private visibility: StageVisibility;
  private readOnly: boolean;

  private value: Record<string, any>;
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

    this.value = {};
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
  withDescription(description: string): this {
    this.description = description;

    return this;
  }

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   */
  withRequired(): this {
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

  /**
   * Ensures a user cannot edit the value.
   *
   * @returns this
   */
  withReadOnly(): this {
    this.readOnly = true;

    return this;
  }

  /**
   * Sets the choice synchronously.
   *
   * @param {Object} choices
   * @returns this
   */
  withChoices(choices: Record<string, any>): this {
    this.value = choices;

    return this;
  }

  /**
   * Sets the choice asynchronously.
   *
   * @callback handler
   * @returns {Promise}
   * @returns this
   */
  withChoicesAsync(handler: () => Promise<Record<string, any>>): this {
    handler()
      .then((choices) => {
        // decode choices to ensure it's the right shape
        this.value = choices;
      })
      .catch((err: unknown) => {
        // log internally
      });

    return this;
  }
}
