import { TextFieldBuilder } from "../../src/field/textField";
import { SheetBuilder } from "../../src/sheet/sheet";

describe("Sheet", () => {
  it("should handle simple creation", () => {
    const textField = new TextFieldBuilder("Foo").build();
    const sheet = new SheetBuilder("Bar").withField("foo", textField).build();

    expect(sheet.getDisplayName()).toBe("Bar");
  });

  it("should handle creation with no sheets", () => {
    expect(() => {
      new SheetBuilder("Bar").build();
    }).toThrowError(Error("A Sheet must include at least one field."));
  });
});
