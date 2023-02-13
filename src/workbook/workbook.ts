import { SheetBuilder as Sheet } from "../sheet/sheet";

class Workbook {
  private readonly name: string;
  private sheets: Array<Sheet>;
  private env: Record<string, unknown>;

  constructor(name: string) {
    this.name = name;
    this.sheets = [];
    this.env = {};
  }

  public getName(): string {
    return this.name;
  }

  public getEnv(): Record<string, unknown> {
    return this.env;
  }

  public addSheet(sheet: Sheet): void {
    this.sheets.concat(sheet);
  }

  public setEnv(env: Record<string, unknown>): void {
    this.env = env;
  }
}

export class WorkbookBuilder {
  private workbook: Workbook;

  constructor(name: string) {
    this.workbook = new Workbook(name);
  }

  withSheet(sheet: Sheet): this {
    this.workbook.addSheet(sheet);

    return this;
  }

  withEnv(env: Record<string, unknown>): this {
    this.workbook.setEnv(env);

    return this;
  }
}
