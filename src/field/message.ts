type Severity = "info" | "warn" | "error";

export class Message {
  private severity: Severity;
  private content: string;

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
}
