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
   * @params {string} message
   */
  info(message: string): void {
    // console.log(message);
  }

  /**
   * Warning message
   *
   * @params {string} message
   */
  warn(message: string): void {
    // console.log(message);
  }

  /**
   * Error message
   *
   * @params {string} message
   */
  error(message: string): void {
    // console.log(message);
  }
}
