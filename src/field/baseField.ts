import { Message } from "./message";

type Nullable<T> = null | T;

interface StageVisibility {
  mapping: boolean;
  review: boolean;
  export: boolean;
}

export abstract class BaseField {
  /**
   * Sets the value in the UI table the user will see.
   *
   * @param {string} label - column header
   * @returns this
   */
  abstract withLabel(label: string): this;

  /**
   * Sets the value in the UI table the user will see when they hover their mouse over the column header.
   *
   * @param {string} description - visible on hover of column header
   * @returns this
   */
  abstract withDescription(description: string): this;

  /**
   * Ensures a field must have a value otherwise an error message will be present.
   *
   * @returns this
   */
  abstract withRequired(): this;

  /**
   * Change when a field is visible during the various import stages.
   *
   * @param {Object} opts - visibility options
   * @param {boolean} [opts.mapping=true] - show during the mapping stage
   * @param {boolean} [opts.review=true] - show during the review stage
   * @param {boolean} [opts.export=true] - show during the export stage
   * @returns this
   */
  abstract withVisibility(opts: Partial<StageVisibility>): this;

  /**
   * Ensures a user cannot edit the value.
   *
   * @returns this
   */
  abstract withReadOnly(): this;

  /**
   * Ensures a value is unique in the entire column.
   *
   * @returns this
   */
  withUnique?(): this;

  /**
   * Sets a default value when none was provided by the user.
   *
   * @param value
   * @returns this
   */
  withDefault?(value: unknown): this;

  /**
   * Change the current value into something new.
   *
   * @callback handler
   * @returns this
   */
  withCompute?(handler: (value: unknown) => unknown): this;
  withCompute?(handler: (value: Nullable<unknown>) => unknown): this;

  /**
   * Validate the current value against certian conditions and display a message to the user when those conditions are not met.
   *
   * @callback handler
   * @returns this
   */
  withValidate?(handler: (value: unknown) => void | Message): this;
  withValidate?(handler: (value: Nullable<unknown>) => void | Message): this;
}
