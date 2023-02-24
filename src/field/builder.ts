import { Message } from "./message";

type Nullable<T> = null | T;
type Env = Record<string, unknown>;

export interface IBuilder<T> {
  withDescription(description: string): this;
  withRequired(): this;
  withVirtual?(): this;
  withReadOnly?(): this;
  withUnique?(): this;
  withDefault?(value: unknown): this;
  withCompute?(handler: (value: Nullable<unknown>) => unknown): this;
  withCompute?(handler: (value: unknown) => unknown): this;
  withValidate?(handler: (value: Nullable<unknown>) => void | Message): this;
  withValidate?(handler: (value: unknown) => void | Message): this;
  withValidateAsync?(
    handler: (value: Nullable<unknown>, env: Env) => Promise<void | Message>,
  ): this;
  withValidateAsync?(
    handler: (value: unknown, env: Env) => Promise<void | Message>,
  ): this;
  build(): T;
}
