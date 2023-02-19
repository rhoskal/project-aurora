import axios from "axios";

import { TextFieldBuilder } from "../../src/field/textField";
import { Message } from "../../src/field/message";
import * as G from "../../src/helpers/typeGuards";

jest.mock("axios", () =>
  jest.fn(() => Promise.resolve({ data: { exists: true } })),
);

describe("TextField", () => {
  it("should handle simple creation", () => {
    const textField = new TextFieldBuilder("Foo").build();

    expect(textField.getLabel()).toBe("Foo");
    expect(textField.getDescription()).toBe("");
    expect(textField.getIsRequired()).toBe(false);
    expect(textField.getIsReadOnly()).toBe(false);
    expect(textField.getIsUnique()).toBe(false);
    expect(textField.getValue()).toBe(null);
    expect(textField.getMessages()).toStrictEqual([]);
  });

  it("should handle setting a description", () => {
    const textField = new TextFieldBuilder("Foo")
      .withDescription("Some description")
      .build();

    const actual: string = textField.getDescription();
    const expected: string = "Some description";

    expect(actual).toBe(expected);
  });

  it("should handle marking as required", () => {
    const textField = new TextFieldBuilder("Foo").withRequired().build();

    const actual: boolean = textField.getIsRequired();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle marking as read-only", () => {
    const textField = new TextFieldBuilder("Foo").withReadOnly().build();

    const actual: boolean = textField.getIsReadOnly();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle marking as unique", () => {
    const textField = new TextFieldBuilder("Foo").withUnique().build();

    const actual: boolean = textField.getIsUnique();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });

  it("should handle a compute fn", () => {
    const textField = new TextFieldBuilder("Foo")
      .withCompute((value) => {
        if (G.isNotNil(value)) {
          return value.toLowerCase();
        } else {
          return "";
        }
      })
      .build();

    expect(textField.getValue()).toBe(null);

    textField.setValue("FOOBAR");
    expect(textField.getValue()).toBe("FOOBAR");

    textField.run();
    expect(textField.getValue()).toBe("foobar");
  });

  it("should handle a validate fn", () => {
    const textField = new TextFieldBuilder("Foo Bar")
      .withValidate((value) => {
        if (G.isNotNil(value) && value.includes("bar")) {
          return new Message("warn", "bar with foo is dangerous");
        }
      })
      .build();

    textField.setValue("foobar");
    expect(textField.getValue()).toBe("foobar");
    expect(textField.getMessages()).toHaveLength(0);

    textField.run();
    expect(textField.getMessages()).toHaveLength(1);
  });

  //   it.only("should handle an async validate fn", () => {
  //     const textField = new TextFieldBuilder("Email Async")
  //       .withRequired()
  //       .withUnique()
  //       .withValidateAsync((value, env) => {
  //         if (G.isNotNil(value)) {
  //           // return (
  //           // axios
  //           //   .get(
  //           //     `https://foobar.com/doesEmailExist?email=${value
  //           //       .trim()
  //           //       .toLowerCase()}`,
  //           //     {},
  //           //   )
  //           return axios({
  //             method: "GET",
  //             url: "https://foobar.com/doesEmailExist",
  //             headers: {},
  //             params: {
  //               email: value.trim().toLowerCase(),
  //             },
  //           })
  //             .then(({ data }: { data: { exists: boolean } }) => {
  //               console.log("data:", JSON.stringify(data, null, 2));
  //               if (data.exists) {
  //                 console.log("it exists");
  //                 return new Message(
  //                   "error",
  //                   `Email: '${value}' already exists.`,
  //                 );
  //               }
  //             })
  //             .catch((_e) => {});
  //         }
  //       })
  //       .build();
  //
  //     expect(textField.getLabel()).toBe("Email Async");
  //     expect(textField.getDescription()).toBe("");
  //     expect(textField.getIsRequired()).toBe(true);
  //     expect(textField.getIsUnique()).toBe(true);
  //
  //     textField.setValue("foo@bar.com");
  //     expect(textField.getValue()).toBe("foo@bar.com");
  //     expect(textField.getMessages()).toHaveLength(0);
  //
  //     textField.run();
  //     expect(axios).toHaveBeenCalled();
  //     expect(textField.getMessages()).toHaveLength(1);
  //   });
});
