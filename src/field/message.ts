type Severity = "info" | "warn" | "error";

export class Message {
  private readonly severity: Severity;
  private readonly content: string;

  /**
   * Creates a visual annotation in the UI table for the user to see.
   *
   * @param severity "info" | "warn" | "error"
   * @param message string
   */
  constructor(severity: Severity, message: string) {
    this.severity = severity;
    this.content = message;
  }

  public getSeverity(): Severity {
    return this.severity;
  }

  public getContent(): string {
    return this.content;
  }
}
