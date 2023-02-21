import { ReferenceFieldBuilder } from "../../src/field/referenceField";

describe("ReferenceField", () => {
  it("should handle simple creation", () => {
    const referenceField = new ReferenceFieldBuilder("Foo").withCardinality("has-one").build();

    expect(referenceField.getLabel()).toBe("Foo");
    expect(referenceField.getDescription()).toBe("");
    expect(referenceField.getIsRequired()).toBe(false);
    expect(referenceField.getCardinality()).toBe("has-one");
  });

  it("should handle setting a description", () => {
    const referenceField = new ReferenceFieldBuilder("Foo")
      .withDescription("Some description")
      .withCardinality("has-one")
      .build();

    const actual: string = referenceField.getDescription();
    const expected: string = "Some description";

    expect(actual).toBe(expected);
  });

  it("should handle marking as required", () => {
    const referenceField = new ReferenceFieldBuilder("Foo")
      .withRequired()
      .withCardinality("has-one")
      .build();

    const actual: boolean = referenceField.getIsRequired();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });
});
