import { TextFieldBuilder } from "../../src/field/textField";
import { SheetBuilder } from "../../src/sheet/sheet";
import { WorkbookBuilder } from "../../src/workbook/workbook";
import { SpaceConfigBuilder } from "../../src/space/spaceConfig";

describe("Sheet", () => {
  it("should handle simple creation", () => {
    const textField = new TextFieldBuilder("Foo").build();
    const sheet = new SheetBuilder("Bar").withField("foo", textField).build();
    const workbook = new WorkbookBuilder("Baz").withSheet(sheet).build();
    const spaceConfig = new SpaceConfigBuilder("X")
      .withWorkbook(workbook)
      .build();

    expect(spaceConfig.getName()).toBe("X");
    expect(spaceConfig.getWorkbooks()).toStrictEqual([workbook]);
  });

  it("should handle creation with no workbooks", () => {
    expect(() => {
      new SpaceConfigBuilder("X").build();
    }).toThrowError(Error("A Space Config must include at least 1 Workbook."));
  });
});
