interface FlatfileLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export class Logger implements FlatfileLogger {
  constructor() {}

  /**
   * Info message
   *
   * @param {string} message
   */
  info(message: string): void {
    console.log(message);
  }

  /**
   * Warning message
   *
   * @param {string} message
   */
  warn(message: string): void {
    console.warn(message);
  }

  /**
   * Error message
   *
   * @param {string} message
   */
  error(message: string): void {
    console.error(message);
  }
}
