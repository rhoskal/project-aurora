import { BaseField } from "./baseField";
import { Message } from "./message";

interface StageVisibility {
  mapping: boolean;
  review: boolean;
  export: boolean;
}

export class OptionField extends BaseField {
  private label: string;
  private description: string;
  private required: boolean;
  private visibility: StageVisibility;
  private readOnly: boolean;

  private value: Record<string, any>;
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

    this.value = {};
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
