import { Workbook } from "../workbook/workbook";
import * as G from "../helpers/typeGuards";

export class SpaceConfig {
  private readonly name: string;
  private slug: string;
  private workbooks: Array<Workbook>;

  constructor(params: {
    name: string;
    slug?: string;
    workbooks: Array<Workbook>;
  }) {
    this.name = params.name;
    this.slug = G.isUndefined(params.slug)
      ? "some_generated_slug"
      : params.slug;
    this.workbooks = params.workbooks;
  }

  /* Name */

  public getName(): string {
    return this.name;
  }

  /* Slug */

  public getSlug(): string {
    return this.slug;
  }

  /* Workbooks */

  public getWorkbooks(): Array<Workbook> {
    return this.workbooks;
  }
}

export class SpaceConfigBuilder {
  private readonly name: string;
  private slug?: string;
  private workooks: Array<Workbook>;

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
  build(): SpaceConfig {
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
