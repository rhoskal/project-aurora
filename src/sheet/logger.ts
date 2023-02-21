interface FlatfileLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export class Logger implements FlatfileLogger {
  constructor() {}

  /**
   * Prints an info type message.
   *
   * @param message
   *
   * @since 0.0.1
   */
  info(message: string): void {
    console.log(message);
  }

  /**
   * Prints a warning type message.
   *
   * @param message
   *
   * @since 0.0.1
   */
  warn(message: string): void {
    console.warn(message);
  }

  /**
   * Prints an error type message.
   *
   * @param message
   *
   * @since 0.0.1
   */
  error(message: string): void {
    console.error(message);
  }
}
