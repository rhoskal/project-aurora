import { WorkbookBuilder as Workbook } from "../workbook/workbook";

class SpaceConfig {
  private name: string;
  private slug: string;
  private workbooks: Array<Workbook>;

  constructor(name: string) {
    this.name = name;
    this.slug = "some_generated_slug";
    this.workbooks = [];
  }

  public getName(): string {
    return this.name;
  }

  public getSlug(): string {
    return this.slug;
  }

  public setSlug(slug: string): void {
    this.slug = slug;
  }

  public getWorkbooks(): Array<Workbook> {
    return this.workbooks;
  }

  public addWorkbook(workbook: Workbook): void {
    this.workbooks = this.workbooks.concat(workbook);
  }
}

export class SpaceConfigBuilder {
  private spaceConfig: SpaceConfig;

  constructor(name: string) {
    this.spaceConfig = new SpaceConfig(name);
  }

  /**
   * Override (customize) the default slug.
   *
   * @param {string} slug
   * @returns this
   */
  public withSlug(slug: string): this {
    this.spaceConfig.setSlug(slug);

    return this;
  }

  /**
   * Add a workbook to the config.
   *
   * @param workbook
   * @returns this
   */
  public withWorkbook(workbook: Workbook): this {
    this.spaceConfig.addWorkbook(workbook);

    return this;
  }
}
