import * as Eq from "fp-ts/Eq";
import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";
import * as Str from "fp-ts/string";

import { Workbook } from "../workbook/workbook";

const eqWorkbook: Eq.Eq<Workbook> = {
  equals: (wb1, wb2) =>
    Str.Eq.equals(wb1.getDisplayName(), wb2.getDisplayName()),
};

/**
 * Build a SpaceConfig.
 *
 * @example
 * import { TextField, Sheet, Workbook, SpaceConfig } from "@";
 * 
 * const textField = new TextField.Builder("Foo").build();
 * const sheet = new Sheet.Builder("Bar").withField("foo", textField).build();
 * const workbook = new Workbook.Builder("Baz").withSheet(sheet).build();
 * const spaceConfig = new SpaceConfig.Builder("X")
     .withWorkbook(workbook)
     .build();
 *
 * @since 0.0.1
 */
export class SpaceConfig {
  readonly #name: string;

  #slug: string;
  #workbooks: ReadonlyArray<Workbook>;

  private constructor(params: {
    name: string;
    slug?: string;
    workbooks: ReadonlyArray<Workbook>;
  }) {
    // params
    this.#name = params.name;

    // internal
    this.#slug = pipe(
      O.fromNullable(params.slug),
      O.getOrElse(() => "some_generated_slug"),
    );
    this.#workbooks = params.workbooks;
  }

  /* Name */

  public getName(): string {
    return this.#name;
  }

  /* Slug */

  public getSlug(): string {
    return this.#slug;
  }

  /* Workbooks */

  public getWorkbooks(): ReadonlyArray<Workbook> {
    return this.#workbooks;
  }

  //---------------------------------------
  // Builder
  //---------------------------------------

  static Builder = class SpaceConfigBuilder {
    readonly #name: string;
    #slug?: string;
    #workooks: ReadonlyArray<Workbook>;

    /**
     * Creates a simple, empty SpaceConfig.
     *
     * @param name
     */
    constructor(name: string) {
      this.#name = name;
      this.#workooks = [];
    }

    /**
     * Override (customize) the default slug.
     *
     * @param slug
     *
     * @returns this
     *
     * @since 0.0.1
     */
    public withSlug(slug: string): this {
      this.#slug = slug;

      return this;
    }

    /**
     * Add a workbook to the config.
     *
     * @param workbook
     *
     * @returns this
     *
     * @since 0.0.1
     */
    public withWorkbook(workbook: Workbook): this {
      this.#workooks = pipe(
        this.#workooks,
        RA.append(workbook),
        RA.uniq(eqWorkbook),
      );

      return this;
    }

    /**
     * Final call to return an instantiated SpaceConfig.
     *
     * @returns SpaceConfig
     *
     * @since 0.0.1
     */
    build(): never | SpaceConfig {
      if (this.#workooks.length === 0) {
        throw new Error("A Space Config must include at least 1 Workbook.");
      }

      return new SpaceConfig({
        name: this.#name,
        slug: this.#slug,
        workbooks: this.#workooks,
      });
    }
  };
}
