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
  // .withOffset(-7)
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
  .withVirtual()
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
  .withLabel("Emails")
  .withDescription("List of emails")
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
  .withEnv({ apiKey: "some_key" });

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
