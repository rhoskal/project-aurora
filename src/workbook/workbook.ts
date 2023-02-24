import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";

import { Sheet } from "../sheet/sheet";

type Env = Record<string, unknown>;

/**
 * Build a Workbook.
 *
 * @example
 * import { TextField, Sheet, Workbook } from "@";
 *
 * const textField = new TextField.Builder("Foo").build();
 * const sheet = new Sheet.Builder("Bar").withField("foo", textField).build();
 * const workbook = new Workbook.Builder("Baz").withSheet(sheet).build();
 *
 * @since 0.0.1
 */
export class Workbook {
  readonly #displayName: string;

  #sheets: ReadonlyArray<Sheet>;
  #env: Env;

  private constructor(params: {
    displayName: string;
    sheets: ReadonlyArray<Sheet>;
    env?: Env;
  }) {
    // params
    this.#displayName = params.displayName;

    // internal
    this.#sheets = params.sheets;
    this.#env = pipe(
      O.fromNullable(params.env),
      O.getOrElse(() => ({})),
    );
  }

  public getDisplayName(): string {
    return this.#displayName;
  }

  public getEnv(): Env {
    return this.#env;
  }

  public getSheets(): ReadonlyArray<Sheet> {
    return this.#sheets;
  }

  //---------------------------------------
  // Builder
  //---------------------------------------

  static Builder = class WorkbookBuilder {
    #displayName: string;
    #sheets: ReadonlyArray<Sheet>;
    #env?: Env;

    /**
     * Creates a simple, empty Workbook.
     *
     * @param displayName
     */
    constructor(displayName: string) {
      this.#displayName = displayName;
      this.#sheets = [];
    }

    /**
     * Adds a Sheet.
     *
     * @param sheet
     *
     * @returns this
     *
     * @since 0.0.1
     */
    withSheet(sheet: Sheet): this {
      this.#sheets = RA.append(sheet)(this.#sheets);

      return this;
    }

    /**
     * Sets the env.
     *
     * @param env
     *
     * @returns this
     *
     * @since 0.0.1
     */
    withEnv(env: Env): this {
      this.#env = env;

      return this;
    }

    /**
     * Final call to return an instantiated Workbook.
     *
     * @returns Workbook
     *
     * @since 0.0.1
     */
    build(): never | Workbook {
      if (this.#sheets.length === 0) {
        throw new Error("A Workbook must include at least 1 Sheet.");
      }

      return new Workbook({
        displayName: this.#displayName,
        sheets: this.#sheets,
        env: this.#env,
      });
    }
  };
}
