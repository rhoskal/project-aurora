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
   * @param label string
   */
  withLabel(label: string) {
    this.label = label;

    return this;
  }

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param description string
   */
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

  withChoices(choices: Record<string, any>) {
    this.value = choices;

    return this;
  }

  withChoicesAsync(handler: () => Promise<Record<string, any>>) {
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
