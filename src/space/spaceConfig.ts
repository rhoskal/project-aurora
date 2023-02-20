import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { Workbook } from "../workbook/workbook";

export class SpaceConfig {
  private readonly name: string;

  private _slug: string;
  private _workbooks: ReadonlyArray<Workbook>;

  constructor(params: {
    name: string;
    slug?: string;
    workbooks: ReadonlyArray<Workbook>;
  }) {
    // params
    this.name = params.name;

    // internal
    this._slug = pipe(
      O.fromNullable(params.slug),
      O.getOrElse(() => "some_generated_slug"),
    );
    this._workbooks = params.workbooks;
  }

  /* Name */

  public getName(): string {
    return this.name;
  }

  /* Slug */

  public getSlug(): string {
    return this._slug;
  }

  /* Workbooks */

  public getWorkbooks(): ReadonlyArray<Workbook> {
    return this._workbooks;
  }
}

export class SpaceConfigBuilder {
  private readonly name: string;
  private slug?: string;
  private workooks: ReadonlyArray<Workbook>;

  constructor(name: string) {
    this.name = name;
    this.workooks = [];
  }

  /**
   * Override (customize) the default slug.
   *
   * @param {string} slug
   * @returns this
   */
  public withSlug(slug: string): this {
    this.slug = slug;

    return this;
  }

  /**
   * Add a workbook to the config.
   *
   * @param workbook
   * @returns this
   */
  public withWorkbook(workbook: Workbook): this {
    this.workooks = this.workooks.concat(workbook);

    return this;
  }

  /**
   * Final call to return an instantiated SpaceConfig.
   *
   * @returns SpaceConfig
   */
  build(): never | SpaceConfig {
    if (this.workooks.length === 0) {
      throw new Error("A Space Config must include at least 1 Workbook.");
    }

    return new SpaceConfig({
      name: this.name,
      slug: this.slug,
      workbooks: this.workooks,
    });
  }
}
