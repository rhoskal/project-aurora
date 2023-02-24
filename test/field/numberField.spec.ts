import { NumberField } from "../../src/field/numberField";
import { Message } from "../../src/field/message";
import * as G from "../../src/helpers/typeGuards";

type Nullable<T> = null | T;

describe("NumberField", () => {
  it("should handle simple creation", () => {
    const numberField = new NumberField.Builder("Foo").build();

    expect(numberField.getLabel()).toBe("Foo");
    expect(numberField.getDescription()).toBe("");
    expect(numberField.getIsRequired()).toBe(false);
    expect(numberField.getIsReadOnly()).toBe(false);
    expect(numberField.getIsUnique()).toBe(false);
    expect(numberField.getValue()).toBe(null);
    expect(numberField.getMessages()).toStrictEqual([]);
  });

  it("should handle setting a description", () => {
    const numberField = new NumberField.Builder("Foo")
      .withDescription("Some description")
      .build();

    const actual: string = numberField.getDescription();
    const expected: string = "Some description";

    expect(actual).toBe(expected);
  });

  it("should handle marking as required", () => {
    const numberField = new NumberField.Builder("Foo").withRequired().build();

    const actual: boolean = numberField.getIsRequired();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle marking as read-only", () => {
    const numberField = new NumberField.Builder("Foo").withReadOnly().build();

    const actual: boolean = numberField.getIsReadOnly();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle marking as unique", () => {
    const numberField = new NumberField.Builder("Foo").withUnique().build();

    const actual: boolean = numberField.getIsUnique();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle using a default value", () => {
    const numberField = new NumberField.Builder("Foo").withDefault(42).build();

    const actual: Nullable<number> = numberField.getValue();
    const expected: number = 42;

    expect(actual).toBe(expected);
  });

  it("should handle a compute fn", () => {
    const numberField = new NumberField.Builder("Foo")
      .withCompute((value) => {
        if (G.isNotNil(value)) {
          return value * 10;
        } else {
          return 0; // this is bad!! handle undefined return type or add a cast fn that will allow a guaranteed input type for this fn
        }
      })
      .build();

    expect(numberField.getValue()).toBe(null);

    numberField.setValue(10);
    expect(numberField.getValue()).toBe(10);

    numberField.run();
    expect(numberField.getValue()).toBe(100);
  });

  it("should handle a validate fn", () => {
    const numberField = new NumberField.Builder("Salary")
      .withValidate((value) => {
        if (G.isNotNil(value) && value < 0) {
          return new Message("warn", "Salary cannot be negative");
        }
      })
      .build();

    numberField.setValue(-42);
    expect(numberField.getValue()).toBe(-42);
    expect(numberField.getMessages()).toHaveLength(0);

    numberField.run();
    expect(numberField.getMessages()).toHaveLength(1);
  });
});
