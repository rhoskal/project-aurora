import { ReferenceField } from "../../src/field/referenceField";

describe("ReferenceField", () => {
  it("should handle simple creation", () => {
    const referenceField = new ReferenceField.Builder("Foo").withCardinality("has-one").build();

    expect(referenceField.getLabel()).toBe("Foo");
    expect(referenceField.getDescription()).toBe("");
    expect(referenceField.getIsRequired()).toBe(false);
    expect(referenceField.getCardinality()).toBe("has-one");
  });

  it("should handle setting a description", () => {
    const referenceField = new ReferenceField.Builder("Foo")
      .withDescription("Some description")
      .withCardinality("has-one")
      .build();

    const actual: string = referenceField.getDescription();
    const expected: string = "Some description";

    expect(actual).toBe(expected);
  });

  it("should handle marking as required", () => {
    const referenceField = new ReferenceField.Builder("Foo")
      .withRequired()
      .withCardinality("has-one")
      .build();

    const actual: boolean = referenceField.getIsRequired();
    const expected: boolean = true;

    expect(actual).toBe(expected);
  });
});
