import { DateFieldBuilder } from "../../src/field/dateField";
import { Message } from "../../src/field/message";
import * as G from "../../src/helpers/typeGuards";

type Nullable<T> = null | T;

const getTomorrow = (): Date => {
  const now: Date = new Date();
  const temp: Date = new Date(now);
  console.log("now:", now);

  return new Date(temp.setDate(temp.getDate() + 1));
};

describe("DateField", () => {
  it("should handle simple creation", () => {
    const textField = new DateFieldBuilder("Foo").build();

    expect(textField.getLabel()).toBe("Foo");
    expect(textField.getDescription()).toBe("");
    expect(textField.getIsRequired()).toBe(false);
    expect(textField.getIsReadOnly()).toBe(false);
    expect(textField.getIsUnique()).toBe(false);
    expect(textField.getDisplayFormat()).toBe(null);
    expect(textField.getEgressFormat()).toBe(null);
    expect(textField.getValue()).toBe(null);
    expect(textField.getMessages()).toStrictEqual([]);
  });

  it("should handle setting a description", () => {
    const dateField = new DateFieldBuilder("Foo")
      .withDescription("Some description")
      .build();

    const actual: string = dateField.getDescription();
    const expected: string = "Some description";

    expect(actual).toBe(expected);
  });

  it("should handle marking as required", () => {
    const dateField = new DateFieldBuilder("Foo").withRequired().build();

    const actual: boolean = dateField.getIsRequired();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle marking as read-only", () => {
    const dateField = new DateFieldBuilder("Foo").withReadOnly().build();

    const actual: boolean = dateField.getIsReadOnly();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle marking as unique", () => {
    const dateField = new DateFieldBuilder("Foo").withUnique().build();

    const actual: boolean = dateField.getIsUnique();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle setting display format", () => {
    const dateField = new DateFieldBuilder("Foo")
      .withDisplayFormat("MM-dd-YYYY")
      .build();

    const actual: Nullable<string> = dateField.getDisplayFormat();
    const expected: string = "MM-dd-YYYY";

    expect(actual).toBe(expected);
  });

  it("should handle setting egress format", () => {
    const dateField = new DateFieldBuilder("Foo")
      .withEgressFormat("MM-dd-YYYY")
      .build();

    const actual: Nullable<string> = dateField.getEgressFormat();
    const expected: string = "MM-dd-YYYY";

    expect(actual).toBe(expected);
  });

  it("should handle a compute fn", () => {});

  //   it("should handle a validate fn", () => {
  //     const dateField = new DateFieldBuilder("Foo")
  //       .withValidate((value) => {
  //         if (G.isNotNil(value) && value > new Date()) {
  //           return new Message("error", "Foo cannot be in the future");
  //         }
  //       })
  //       .build();
  //
  //     const tomorrow: Date = getTomorrow();
  //     console.log("tomorrow:", tomorrow);
  //     dateField.setValue(tomorrow);
  //     expect(dateField.getValue()).toStrictEqual(tomorrow);
  //     expect(dateField.getMessages()).toHaveLength(0);
  //
  //     const actual: Array<Message> = dateField.getMessages();
  //     const expected: number = 1;
  //
  //     dateField.run();
  //     expect(actual).toHaveLength(expected);
  //   });
});
