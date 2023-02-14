export interface FlatfileRecord {
  get(key: string): unknown;
  set(key: string, value: string | number | object): this;
  // modify(key: string, handler: (value) => value): null | string | number | object;
  addInfo(key: string, message: string): this;
  addInfo(keys: Array<string>, message: string): this;
  addWarning(key: string, message: string): this;
  addWarning(keys: Array<string>, message: string): this;
  addError(key: string, message: string): this;
  addError(keys: Array<string>, message: string): this;
}

// export class DataRecord implements FlatfileRecord<T> {
//   private value: unknown;

//   constructor() {
//     this.value = null;
//   }

//   get(key: string) { }

//   set(key: string) {
//     return this;
//   }

//   addInfo(key: string, message: string): this
//   addInfo(keys: Array<string>, message: string): this {
//     return this;
//   }
// }
