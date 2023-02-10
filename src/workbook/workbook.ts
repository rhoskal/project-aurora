import { Sheet } from "../sheet/sheet";

export class Workbook {
  private name: string;
  private sheets: Array<Sheet>;
  private env: Record<string, any>;

  constructor(name: string) {
    this.name = name;
    this.sheets = [];
    this.env = {};
  }

  withSheet(sheet: Sheet) {
    this.sheets.concat(sheet);

    return this;
  }

  withEnv(env: Record<string, any>) {
    this.env = env;

    return this;
  }
}
