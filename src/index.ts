import axios from "axios";

import { ArrayFieldBuilder } from "./field/arrayField";
import { DateFieldBuilder } from "./field/dateField";
import { Message } from "./field/message";
import { NumberFieldBuilder } from "./field/numberField";
import { OptionFieldBuilder } from "./field/optionField";
import { SheetBuilder } from "./sheet/sheet";
import { TextFieldBuilder } from "./field/textField";
import { WorkbookBuilder } from "./workbook/workbook";
import { ReferenceFieldBuilder } from "./field/referenceField";
// import { FlatfileRecordBuilder as FlatfileRecord } from "./sheet/flatfileRecord";
import { SpaceConfigBuilder } from "./space/spaceConfig";
import * as G from "./helpers/typeGuards";

const firstName = new TextFieldBuilder("First Name")
  .withDescription("Contact's legal first Name")
  .build();

const lastName = new TextFieldBuilder("Last Name")
  .withDescription("Contact's legal last Name")
  .build();

const dob = new DateFieldBuilder("Date of Birth")
  // .withOffset(-7)
  // .withLocale("fr")
  .withDisplayFormat("dd/MM/yyyy")
  .withValidate((value) => {
    if (G.isNotNil(value) && value > new Date()) {
      return new Message("error", "dob cannot be in the future");
    }
  })
  .build();

const salary = new NumberFieldBuilder("Salary")
  .withValidate((value) => {
    if (G.isNotNil(value) && value < 0) {
      return new Message("error", "Salary cannot be negative");
    }
  })
  .build();

// const age = new NumberField()
//   .withLabel("Age")
//   .withReadOnly()
//   .withVirtual()
//   .withCompute((value) => {
//     // how to access dob?
//     // computed fields need to reference another field
//   });

const emailSimple = new TextFieldBuilder("Email Simple")
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

const emailAsync = new TextFieldBuilder("Email Async")
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

const phones = new ArrayFieldBuilder<string>("Phone Numbers")
  .withDescription("List of phone numbers")
  .withCompute((values) => {
    return values.map((value) => value.trim().replace(/\D/g, ""));
  })
  .build();

const state = new OptionFieldBuilder("State")
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
const reference = new ReferenceFieldBuilder("Some reference field")
  .withDescription("asdf")
  .withCardinality("has-one")
  // .withForeignKey("key", sheet) // but we haven't created sheet yet :(
  // .withReferenceField(field) // how to access other sheet?
  // .withRelation(field, references: key) // like Prisma
  .build();

const contactsSheet = new SheetBuilder("Contacts")
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
  // .withAction((event) => {})
  // .withAction("records:updated", (event) => {})
  .build();

const workbook = new WorkbookBuilder("Fundraiser Contacts")
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

export default new SpaceConfigBuilder("Test")
  .withSlug("some-slug")
  .withWorkbook(workbook)
  .build();
