import { OptionFieldBuilder } from "../../src/field/optionField";

type Nullable<T> = null | T;

describe("OptionField", () => {
  it("should handle simple creation", () => {
    const choices: Record<"colorado", string> = {
      colorado: "Colorado",
    };

    const optionField = new OptionFieldBuilder("Foo")
      .withChoices(choices)
      .build();

    expect(optionField.getLabel()).toBe("Foo");
    expect(optionField.getDescription()).toBe("");
    expect(optionField.getIsRequired()).toBe(false);
    expect(optionField.getValue()).toBe(null);
    expect(optionField.getMessages()).toStrictEqual([]);
  });

  it("should handle setting a description", () => {
    const choices: Record<"colorado", string> = {
      colorado: "Colorado",
    };

    const optionField = new OptionFieldBuilder("Foo")
      .withDescription("Some description")
      .withChoices(choices)
      .build();

    const actual: string = optionField.getDescription();
    const expected: string = "Some description";

    expect(actual).toBe(expected);
  });

  it("should handle marking as required", () => {
    const choices: Record<"colorado", string> = {
      colorado: "Colorado",
    };

    const optionField = new OptionFieldBuilder("Foo")
      .withRequired()
      .withChoices(choices)
      .build();

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

  //   it("should handle setting choices asynchronously", () => {
  //     const choices: Record<"colorado", string> = {
  //       colorado: "Colorado",
  //     };
  //
  //     const optionField = new OptionFieldBuilder("State")
  //       .withChoicesAsync((_env) => Promise.resolve(choices))
  //       .build();
  //
  //     optionField.run();
  //     expect(optionField.getChoices()).toStrictEqual(choices);
  //
  //     optionField.setValue("colorado");
  //
  //     const actual: Nullable<string> = optionField.getValue();
  //     const expected: string = "colorado";
  //
  //     expect(actual).toBe(expected);
  //   });

  it("should handle creation attempt with no choices set", () => {
    expect(() => {
      new OptionFieldBuilder("Foo").build();
    }).toThrowError(
      Error("Either `withChoices()` or `withChoicesAsync()` must be present."),
    );
  });

  it("should handle creation attempt with both choices set", () => {
    expect(() => {
      const choices: Record<"colorado", string> = {
        colorado: "Colorado",
      };

      new OptionFieldBuilder("State")
        .withChoices(choices)
        .withChoicesAsync((_env) => Promise.resolve(choices))
        .build();
    }).toThrowError(
      Error(
        "Please choose either `withChoices()` or `withChoicesAsync()` since both are present.",
      ),
    );
  });
});
