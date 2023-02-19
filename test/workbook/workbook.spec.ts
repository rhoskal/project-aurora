import { TextFieldBuilder } from "../../src/field/textField";
import { SheetBuilder } from "../../src/sheet/sheet";
import { WorkbookBuilder } from "../../src/workbook/workbook";

describe("Workbook", () => {
  it("should handle simple creation", () => {
    const textField = new TextFieldBuilder("Foo").build();
    const sheet = new SheetBuilder("Bar").withField("foo", textField).build();
    const workbook = new WorkbookBuilder("Baz").withSheet(sheet).build();

    expect(workbook.getDisplayName()).toBe("Baz");
    expect(workbook.getSheets()).toStrictEqual([sheet]);
    expect(workbook.getEnv()).toStrictEqual({});
  });

  it("should handle creation with no sheets", () => {
    expect(() => {
      new WorkbookBuilder("Baz").build();
    }).toThrowError(Error("A Workbook must include at least 1 Sheet."));
  });

  it("should handle setting env vars", () => {});
});
