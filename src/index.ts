import { ArrayField } from "./field/arrayField";
import { DateField } from "./field/dateField";
import { Message } from "./field/message";
import { NumberField } from "./field/numberField";
import { OptionField } from "./field/optionField";
import { Sheet } from "./sheet/sheet";
import { TextField } from "./field/textField";
import { Workbook } from "./workbook/workbook";
import * as G from "./helpers/typeGuards";

const firstName = new TextField()
  .withLabel("Contact's legal first Name")
  .withDescription("Your first name");

const lastName = new TextField()
  .withLabel("Contact's legal last Name")
  .withDescription("Your last name");

const age = new NumberField()
  .withLabel("Age")
  .withDescription("Contact's current age")
  .withValidate((value) => {
    if (G.isNotNil(value) && value < 18) {
      return new Message("error", "cannot include minors");
    }
  });

const dob = new DateField()
  .withLabel("Date of Birth")
  .withOffset(-7)
  // .withLocale("fr")
  .withDisplayFormat("dd/MM/yyyy")
  .withValidate((value) => {
    if (G.isNotNil(value) && value > new Date()) {
      return new Message("error", "dob cannot be in the future");
    }
  });

const email = new TextField()
  .withRequired()
  .withUnique()
  .withVisibility({ mapping: false })
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

    // what if I want to make an API call here?
    // how to access to env vars?
  });

const emails = new ArrayField<string>()
  .withLabel("List of emails")
  .withCompute((values) => {
    return values.map((value) => value.trim().toLowerCase());
  });

const state = new OptionField()
  .withLabel("State")
  // .withChoices({
  //   colorado: "Colorado",
  // })
  .withChoicesAsync(() => {
    return Promise.resolve({
      colorado: "Colorado",
    });
  });

const contactsSheet = new Sheet("Contacts")
  .withField("first_name", firstName)
  .withField("last_name", lastName)
  .withField("email", email)
  .withField("emails", emails)
  .withField("state", state)
  .withField("age", age)
  .withField("dob", dob)
  .withCompute(({ records, session, logger }) => {
    // records.map((record) => {
    //   const firstName = record.get("first_name");
    //   const lastName = record.get("last_name");
    //
    //   if (firstName === null && lastName === null) {
    //     record.addWarning(["first_name", "last_name"], "One must be present.");
    //   }
    //
    //   // also add async here or `.withComputeAsync(({ records, _session, _logger }) => { })` ??
    //
    //   return record;
    // });
  })
  .withAction((event) => {});

const workbook = new Workbook("Fundraiser Contacts")
  .withSheet(contactsSheet)
  .withEnv({ apiKey: "some_key" });
