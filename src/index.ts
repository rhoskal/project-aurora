import axios from "axios";

import { ArrayField } from "./field/arrayField";
import { DateField } from "./field/dateField";
import { Message } from "./field/message";
import { NumberField } from "./field/numberField";
import { OptionField } from "./field/optionField";
import { Sheet } from "./sheet/sheet";
import { TextField } from "./field/textField";
import { Workbook } from "./workbook/workbook";
import { ReferenceField } from "./field/referenceField";
// import { FlatfileRecordBuilder as FlatfileRecord } from "./sheet/flatfileRecord";
import { SpaceConfig } from "./space/spaceConfig";
import * as G from "./helpers/typeGuards";

const firstName = new TextField.Builder("First Name")
  .withDescription("Contact's legal first Name")
  .build();

const lastName = new TextField.Builder("Last Name")
  .withDescription("Contact's legal last Name")
  .build();

const dob = new DateField.Builder("Date of Birth")
  // .withOffset(-7)
  // .withLocale("fr")
  .withDisplayFormat("dd/MM/yyyy")
  .withValidate((value) => {
    if (G.isNotNil(value) && value > new Date()) {
      return new Message("error", "dob cannot be in the future");
    }
  })
  .build();

const salary = new NumberField.Builder("Salary")
  .withValidate((value) => {
    if (G.isNotNil(value) && value < 0) {
      return new Message("error", "Salary cannot be negative");
    }
  })
  .build();

// const age = new NumberFieldBuilder("Age")
//   .withReadOnly()
//   .withCompute((value) => {
//     // how to access dob?
//     // computed fields need to reference other fields within the sheet
//   });
// const age = new ComputedFieldBuilder("Age");

const emailSimple = new TextField.Builder("Email Simple")
  .withRequired()
  .withUnique()
  .withCompute((value) => {
    if (G.isNotNil(value)) {
      return value.trim().toLowerCase();
    } else {
      return "";
    }
  })
  .withValidate((value) => {
    if (G.isNotNil(value) && G.isFalsy(value.includes("@"))) {
      return new Message("error", "what the foo bar!?");
    }
  })
  .build();

const emailAsync = new TextField.Builder("Email Async")
  .withRequired()
  .withUnique()
  .withValidateAsync(async (value, env) => {
    if (G.isNotNil(value)) {
      return axios({
        method: "GET",
        url: "",
        headers: {
          "x-auth-key": `${env.authKey}`,
        },
        params: {
          email: value.trim().toLowerCase(),
        },
      })
        .then(({ data }: { data: { exists: boolean } }) => {
          if (data.exists) {
            return new Message("error", "what the foo bar!?");
          }
        })
        .catch((_e) => {});
    }
  })
  .build();

const phones = new ArrayField.Builder<string>("Phone Numbers")
  .withDescription("List of phone numbers")
  .withCompute((values) => {
    return values.map((value) => value.trim().replace(/\D/g, ""));
  })
  .build();

const state = new OptionField.Builder("State")
  .withDescription("You better pick Colorado!")
  // .withChoices({
  //   colorado: "Colorado",
  // })
  .withChoicesAsync(async (env) => {
    return axios({
      method: "GET",
      url: "",
      headers: {
        "x-auth-key": `${env.authKey}`,
      },
    })
      .then(({ data }: { data: Record<string, string> }) => data)
      .catch((_e) => ({}));
  })
  .build();

// should this exist on the workbook since we have access to the sheets their?
// how to continue builder pattern here when so many params are required?
const reference = new ReferenceField.Builder("Some reference field")
  .withDescription("asdf")
  .withCardinality("has-one")
  // .withForeignKey("key", sheet) // but we haven't created sheet yet :(
  // .withReferenceField(field) // how to access other sheet?
  // .withRelation(field, references: key) // like Prisma
  .build();

const contactsSheet = new Sheet.Builder("Contacts")
  .withField("first_name", firstName)
  .withField("last_name", lastName)
  .withField("emailSimple", emailSimple)
  .withField("emailAsync", emailAsync)
  .withField("phones", phones)
  .withField("state", state)
  .withField("dob", dob)
  .withField("salary", salary)
  // .withCompute(({ records, env, logger }) => {
  //   records.map((record) => {
  //     const firstName = record.get("first_name");
  //     const lastName = record.get("last_name");
  //     if (firstName === null && lastName === null) {
  //       record.addWarning(["first_name", "last_name"], "One must be present.");
  //     }
  //     // also add async here or `.withComputeAsync(({ records, _session, _logger }) => { })` ??
  //     logger.info("howdy");
  //     return record;
  //   });
  // })
  .withAction(["records:created", "records:updated"], (event) => {})
  // .withComputedField("age", ["dob"], age);
  .build();

const workbook = new Workbook.Builder("Fundraiser Contacts")
  .withSheet(contactsSheet)
  .withEnv({ authKey: "some_key" })
  .build();

// const record = new FlatfileRecord<{
//   first_name: null | string;
//   last_name: null | string;
// }>({ first_name: "Hans", last_name: "Hoffman" });
// const fname = record.get("first_name");
// record.addError(["first_name", "last_name"], "foobar");

// const record2 = new FlatfileRecord<{ age: null | number }>({ age: 18 });
// const fname2 = record2.get("age");

// const record3 = new FlatfileRecord<{ emails: Array<string> }>({
//   emails: ["foo@bar.com"],
// });
// const x = record3.get("emails");
// record3.addError("emails", "a");

export default new SpaceConfig.Builder("Test")
  .withSlug("some-slug")
  .withWorkbook(workbook)
  .build();
