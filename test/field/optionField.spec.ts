import { OptionFieldBuilder } from "../../src/field/optionField";
import { Message } from "../../src/field/message";
import * as G from "../../src/helpers/typeGuards";

type Nullable<T> = null | T;

describe("OptionField", () => {
  it("should handle simple creation", () => {
    const optionField = new OptionFieldBuilder("Foo").build();

    expect(optionField.getLabel()).toBe("Foo");
    expect(optionField.getDescription()).toBe("");
    expect(optionField.getIsRequired()).toBe(false);
    expect(optionField.getValue()).toBe(null);
    expect(optionField.getMessages()).toStrictEqual([]);
  });

  it("should handle setting a description", () => {
    const optionField = new OptionFieldBuilder("Foo")
      .withDescription("Some description")
      .build();

    const actual: string = optionField.getDescription();
    const expected: string = "Some description";

    expect(actual).toBe(expected);
  });

  it("should handle marking as required", () => {
    const optionField = new OptionFieldBuilder("Foo").withRequired().build();

    const actual: boolean = optionField.getIsRequired();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle setting choices synchronously", () => {
    const choices: Record<"colorado", string> = {
      colorado: "Colorado",
    };

    const optionField = new OptionFieldBuilder("State")
      .withChoices(choices)
      .build();

    expect(optionField.getChoices()).toStrictEqual(choices);

    optionField.setValue("colorado");

    const actual: Nullable<string> = optionField.getValue();
    const expected: string = "colorado";

    expect(actual).toBe(expected);
  });

  it("should handle setting choices asynchronously", () => {});
});
