import { Message } from "./message";

type Nullable<T> = null | T;

export interface Builder {
  withLabel(label: string): this;
  withDescription(description: string): this;
  withRequired(): this;
  withVirtual(): this;
  withReadOnly(): this;
  withUnique?(): this;
  withDefault?(value: unknown): this;
  withCompute?(handler: (value: unknown) => unknown): this;
  withCompute?(handler: (value: Nullable<unknown>) => unknown): this;
  withValidate?(handler: (value: unknown) => void | Message): this;
  withValidate?(handler: (value: Nullable<unknown>) => void | Message): this;
  // done(): this;
}
