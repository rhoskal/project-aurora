type Severity = "info" | "warn" | "error";

export class Message {
  readonly #severity: Severity;
  readonly #content: string;

  /**
   * Creates a visual annotation in the UI table for the user to see.
   *
   * @param severity "info" | "warn" | "error"
   * @param message string
   */
  constructor(severity: Severity, message: string) {
    this.#severity = severity;
    this.#content = message;
  }

  /**
   * Gets the serverity.
   *
   * @returns Severity
   *
   * @since 0.0.1
   */
  public getSeverity(): Severity {
    return this.#severity;
  }

  /**
   * Gets the content.
   *
   * @returns string
   *
   * @since 0.0.1
   */
  public getContent(): string {
    return this.#content;
  }
}
