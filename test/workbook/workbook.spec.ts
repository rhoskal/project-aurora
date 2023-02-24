import { TextField } from "../../src/field/textField";
import { Sheet } from "../../src/sheet/sheet";
import { Workbook } from "../../src/workbook/workbook";

describe("Workbook", () => {
  it("should handle simple creation", () => {
    const textField = new TextField.Builder("Foo").build();
    const sheet = new Sheet.Builder("Bar").withField("foo", textField).build();
    const workbook = new Workbook.Builder("Baz").withSheet(sheet).build();

    expect(workbook.getDisplayName()).toBe("Baz");
    expect(workbook.getSheets()).toStrictEqual([sheet]);
    expect(workbook.getEnv()).toStrictEqual({});
  });

  it("should handle creation with no sheets", () => {
    expect(() => {
      new Workbook.Builder("Baz").build();
    }).toThrowError(Error("A Workbook must include at least 1 Sheet."));
  });

  it("should handle setting env vars", () => {});
});
