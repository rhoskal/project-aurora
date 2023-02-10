export class Workbook {
  private name: string;
  private env: Record<string, any>;

  constructor(name: string) {
    this.name = name;
    this.env = {};
  }

  withSheet() {
    return this;
  }

  withEnv(env: Record<string, any>) {
    this.env = env;

    return this;
  }
}
