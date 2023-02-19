import { Message } from "../../src/field/message";

describe("Message", () => {
  it("should handle info severity", () => {
    const message = new Message("info", "Foo");

    expect(message.getSeverity()).toBe("info");
    expect(message.getContent()).toBe("Foo");
  });

  it("should handle warn severity", () => {
    const message = new Message("warn", "Foo");

    expect(message.getSeverity()).toBe("warn");
    expect(message.getContent()).toBe("Foo");
  });

  it("should handle error severity", () => {
    const message = new Message("error", "Foo");

    expect(message.getSeverity()).toBe("error");
    expect(message.getContent()).toBe("Foo");
  });
});
