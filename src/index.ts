import axios from "axios";

import { ArrayFieldBuilder as ArrayField } from "./field/arrayField";
import { DateFieldBuilder as DateField } from "./field/dateField";
import { Message } from "./field/message";
import { NumberFieldBuilder as NumberField } from "./field/numberField";
import { OptionFieldBuilder as OptionField } from "./field/optionField";
import { SheetBuilder as Sheet } from "./sheet/sheet";
import { TextFieldBuilder as TextField } from "./field/textField";
import { WorkbookBuilder as Workbook } from "./workbook/workbook";
import { FlatfileRecordBuilder as FlatfileRecord } from "./sheet/flatfileRecord";
import { SpaceConfigBuilder as SpaceConfig } from "./space/spaceConfig";
import * as G from "./helpers/typeGuards";

const firstName = new TextField()
  .withLabel("First Name")
  .withDescription("Contact's legal first Name");

const lastName = new TextField()
  .withLabel("Last Name")
  .withDescription("Contact's legal last Name");

const dob = new DateField()
  .withLabel("Date of Birth")
  // .withOffset(-7)
  // .withLocale("fr")
  .withDisplayFormat("dd/MM/yyyy")
  .withValidate((value) => {
    if (G.isNotNil(value) && value > new Date()) {
      return new Message("error", "dob cannot be in the future");
    }
  });

const salary = new NumberField().withLabel("Salary").withValidate((value) => {
  if (G.isNotNil(value) && value < 0) {
    return new Message("error", "Salary cannot be negative");
  }
});

// const age = new NumberField()
//   .withLabel("Age")
//   .withReadOnly()
//   .withVirtual()
//   .withCompute((value) => {
//     // how to access dob?
//     // computed fields need to reference another field
//   });

const emailSimple = new TextField()
  .withLabel("Email Simple")
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
  });

const emailAsync = new TextField()
  .withLabel("Email Async")
  .withRequired()
  .withUnique()
  .withValidateAsync((value, env) => {
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
        .catch((e) => {});
    }
  });

const phones = new ArrayField<string>()
  .withLabel("Phone Numbers")
  .withDescription("List of phone numbers")
  .withCompute((values) => {
    return values.map((value) => value.trim().replace(/\D/g, ""));
  });

const state = new OptionField()
  .withLabel("State")
  .withDescription("You better pick Colorado!")
  // .withChoices({
  //   colorado: "Colorado",
  // })
  .withChoicesAsync((env) => {
    return axios({
      method: "GET",
      url: "",
      headers: {
        "x-auth-key": `${env.authKey}`,
      },
    })
      .then(({ data }: { data: Record<string, string> }) => data)
      .catch((e) => ({}));
  });

const contactsSheet = new Sheet("Contacts")
  .withField("first_name", firstName)
  .withField("last_name", lastName)
  .withField("emailSimple", emailSimple)
  .withField("emailAsync", emailAsync)
  .withField("phones", phones)
  .withField("state", state)
  .withField("dob", dob)
  .withField("salary", salary)
  .withCompute(({ records, meta, logger }) => {
    // records.map((record) => {
    //   const firstName = record.get("first_name");
    //   const lastName = record.get("last_name");
    //   if (firstName === null && lastName === null) {
    //     record.addWarning(["first_name", "last_name"], "One must be present.");
    //   }
    //   // also add async here or `.withComputeAsync(({ records, _session, _logger }) => { })` ??
    //   logger.info("howdy");
    //   return record;
    // });
  })
  .withAction((event) => {});
// .withAction("records:updated", (event) => {});

const workbook = new Workbook("Fundraiser Contacts")
  .withSheet(contactsSheet)
  .withEnv({ authKey: "some_key" });

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

export default new SpaceConfig("Test")
  .withSlug("some-slug")
  .withWorkbook(workbook);
