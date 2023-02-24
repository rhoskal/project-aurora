import { TextField } from "../../src/field/textField";
import { Sheet } from "../../src/sheet/sheet";
import { Workbook } from "../../src/workbook/workbook";
import { SpaceConfig } from "../../src/space/spaceConfig";

describe("SpaceConfig", () => {
  it("should handle simple creation", () => {
    const textField = new TextField.Builder("Foo").build();
    const sheet = new Sheet.Builder("Bar").withField("foo", textField).build();
    const workbook = new Workbook.Builder("Baz").withSheet(sheet).build();
    const spaceConfig = new SpaceConfig.Builder("X")
      .withWorkbook(workbook)
      .build();

    expect(spaceConfig.getName()).toBe("X");
    expect(spaceConfig.getWorkbooks()).toStrictEqual([workbook]);
  });

  it("should handle creation with no workbooks", () => {
    expect(() => {
      new SpaceConfig.Builder("X").build();
    }).toThrowError(Error("A Space Config must include at least 1 Workbook."));
  });
});
