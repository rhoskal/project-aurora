# Project Aurora

PureScript version [here](https://github.com/hansjhoffman/silver-sky).

## TODO's

- [ ] Dependency injection for environment from Workbook all the way down to fields
- [ ] Records typing inference in Sheet `.withCompute()`
- [ ] `ComputedField`
- [ ] `ReferenceField`

## Feedback

Builder pattern -- separates the construction of a complex object from its representation

- Lack of spontaneous/intuitive "discovery" while building in the P. SDK ==> builder pattern
- There's "configure" and then there's "configure with best practices" ==> e.g. field label is required
- Lack of type narrowing in some cases ==> new `FlatfileRecord`
- Lack of `record.get()` type narrowing ==> used inferred typing
- No async field hooks ==> `withComputeAsync` & `withChoicesAsync`
  - Access to env is only available in record hooks ==> add to field hooks
- Logger class has `any` type ==> added typing
- Could have better code editor / IDE experience ==> JSDOC's (`@example` and `@since`)
  - adds 2 layers of docs right in the code itself (not external on a website or a readme); simple via JSDOC, and complex through type signature
- Testing could be easier ==> show fancy tests
