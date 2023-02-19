import { Sheet } from "../sheet/sheet";
import * as G from "../helpers/typeGuards";

type Env = Record<string, unknown>;

export class Workbook {
  private readonly displayName: string;

  private readonly _sheets: Array<Sheet>;
  private readonly _env: Env;

  constructor(params: {
    displayName: string;
    sheets: Array<Sheet>;
    env?: Env;
  }) {
    // params
    this.displayName = params.displayName;

    // internal
    this._sheets = params.sheets;
    this._env = G.isUndefined(params.env) ? {} : params.env;
  }

  public getDisplayName(): string {
    return this.displayName;
  }

  public getEnv(): Env {
    return this._env;
  }

  public getSheets(): Array<Sheet> {
    return this._sheets;
  }
}

export class WorkbookBuilder {
  private displayName: string;
  private sheets: Array<Sheet>;
  private env?: Env;

  constructor(displayName: string) {
    this.displayName = displayName;
    this.sheets = [];
  }

  withSheet(sheet: Sheet): this {
    this.sheets = this.sheets.concat(sheet);

    return this;
  }

  withEnv(env: Env): this {
    this.env = env;

    return this;
  }

  /**
   * Final call to return an instantiated Workbook.
   *
   * @returns Workbook
   */
  build(): Workbook {
    if (this.sheets.length === 0) {
      throw new Error("A Workbook must include at least 1 Sheet.");
    }

    return new Workbook({
      displayName: this.displayName,
      sheets: this.sheets,
      env: this.env,
    });
  }
}
