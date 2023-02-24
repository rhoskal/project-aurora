import { ArrayField } from "../../src/field/arrayField";
import { Message } from "../../src/field/message";
import * as G from "../../src/helpers/typeGuards";

describe("ArrayField", () => {
  it("should handle simple creation", () => {
    const arrayField = new ArrayField.Builder("Foo").build();

    expect(arrayField.getLabel()).toBe("Foo");
    expect(arrayField.getDescription()).toBe("");
    expect(arrayField.getIsRequired()).toBe(false);
    expect(arrayField.getIsReadOnly()).toBe(false);
    expect(arrayField.getIsUnique()).toBe(false);
    expect(arrayField.getValue()).toStrictEqual([]);
    expect(arrayField.getMessages()).toStrictEqual([]);
  });

  it("should handle setting a description", () => {
    const arrayField = new ArrayField.Builder("Foo")
      .withDescription("Some description")
      .build();

    const actual: string = arrayField.getDescription();
    const expected: string = "Some description";

    expect(actual).toBe(expected);
  });

  it("should handle marking as required", () => {
    const arrayField = new ArrayField.Builder("Foo").withRequired().build();

    const actual: boolean = arrayField.getIsRequired();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle marking as read-only", () => {
    const arrayField = new ArrayField.Builder("Foo").withReadOnly().build();

    const actual: boolean = arrayField.getIsReadOnly();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle marking as unique", () => {
    const arrayField = new ArrayField.Builder("Foo").withUnique().build();

    const actual: boolean = arrayField.getIsUnique();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle a compute fn", () => {
    const arrayField = new ArrayField.Builder<string>("Foo")
      .withCompute((values) => {
        return values.map((value) => value.trim().replace(/\D/g, ""));
      })
      .build();

    expect(arrayField.getValue()).toStrictEqual([]);

    arrayField.setValue(["123-456-7890"]);
    expect(arrayField.getValue()).toStrictEqual(["123-456-7890"]);

    arrayField.run();
    expect(arrayField.getValue()).toStrictEqual(["1234567890"]);
  });

  it("should handle a validate fn", () => {
    const arrayField = new ArrayField.Builder<string>("Foo")
      .withValidate((value) => {
        if (G.isNotNil(value) && value.includes("1234567890")) {
          return new Message("error", "This is a restricted phone number.");
        }
      })
      .build();

    arrayField.setValue(["1234567890"]);
    expect(arrayField.getValue()).toStrictEqual(["1234567890"]);
    expect(arrayField.getMessages()).toHaveLength(0);

    arrayField.run();
    expect(arrayField.getMessages()).toHaveLength(1);
  });
});
