import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";
import { Sheet } from "../sheet/sheet";

type Env = Record<string, unknown>;

export class Workbook {
  private readonly displayName: string;

  private _sheets: ReadonlyArray<Sheet>;
  private _env: Env;

  constructor(params: {
    displayName: string;
    sheets: ReadonlyArray<Sheet>;
    env?: Env;
  }) {
    // params
    this.displayName = params.displayName;

    // internal
    this._sheets = params.sheets;
    this._env = pipe(
      O.fromNullable(params.env),
      O.getOrElse(() => ({})),
    );
  }

  public getDisplayName(): string {
    return this.displayName;
  }

  public getEnv(): Env {
    return this._env;
  }

  public getSheets(): ReadonlyArray<Sheet> {
    return this._sheets;
  }
}

export class WorkbookBuilder {
  private displayName: string;
  private sheets: ReadonlyArray<Sheet>;
  private env?: Env;

  constructor(displayName: string) {
    this.displayName = displayName;
    this.sheets = [];
  }

  withSheet(sheet: Sheet): this {
    this.sheets = RA.append(sheet)(this.sheets);

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
  build(): never | Workbook {
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
