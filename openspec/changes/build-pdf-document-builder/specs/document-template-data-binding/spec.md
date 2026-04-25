# Delta for Document Template Data Binding

## ADDED Requirements

### Requirement: Typed variable registry

The system SHALL define variables with type, group, label, sample value,
fallback policy, formatter metadata, and required status.

Variable groups SHALL include organization, recipient, donation, document,
missionary, tax receipt, financial report, statement, and invoice.

#### Scenario: Registry includes receipt variables

- GIVEN a staff user builds a donation receipt
- WHEN they browse variables
- THEN organization, recipient, donation, document, and tax receipt variables
  are available
- AND each variable has type and sample metadata

#### Scenario: Registry includes financial report variables

- GIVEN a finance user builds a financial report
- WHEN they browse variables
- THEN financial report variables are available
- AND report period, fund, account, income, expense, and balance fields can be
  represented without custom string hacks

### Requirement: Variable chips

The editor SHALL represent variables as structured inline chips rather than
fragile plain text.

#### Scenario: Insert donor name chip

- GIVEN staff are editing a donor letter
- WHEN they insert donor full name
- THEN the editor creates a variable chip bound to the typed registry key
- AND staff cannot accidentally corrupt the key by editing plain text

#### Scenario: Pasted raw merge tag

- GIVEN staff paste `{{unknown_field}}` into a template
- WHEN the editor parses the content
- THEN the system flags it as an unknown variable
- AND it does not silently treat it as valid

### Requirement: Fallback values

Variables MAY define fallback values. Missing required values SHALL produce
validation errors before publish or production render.

#### Scenario: Optional missionary location fallback

- GIVEN a missionary support report includes optional location
- WHEN the selected record lacks location data
- THEN the fallback value is rendered
- AND validation does not fail for that optional field

#### Scenario: Missing required donor field

- GIVEN annual statements require donor full name
- WHEN a donor record lacks the name
- THEN binding validation fails for that document
- AND the statement is not generated silently

### Requirement: Formatters

The system SHALL support formatters for currency, date, number, percentage,
address, receipt number, and fiscal period values.

#### Scenario: Currency formatting

- GIVEN a donation line item amount is numeric
- WHEN it is rendered in a receipt
- THEN the selected currency formatter controls display
- AND the numeric value remains available for totals

#### Scenario: Fiscal period formatting

- GIVEN an annual statement covers a fiscal period
- WHEN the statement period is rendered
- THEN the fiscal period formatter controls display
- AND the same period controls donation selection

### Requirement: Conditional sections

The editor SHALL support conditional sections based on structured rules.

#### Scenario: Conditional tax language

- GIVEN a tax receipt has different language for gifts with goods or services
- WHEN goods/services value is greater than zero
- THEN the matching conditional language renders
- AND the no-goods/services language is omitted

#### Scenario: Fund-specific language

- GIVEN a donor letter includes fund-specific language
- WHEN the gift designation matches the selected fund
- THEN the configured section renders
- AND other fund-specific sections are omitted

### Requirement: Repeaters

The editor SHALL support repeaters for arrays of data, including donations,
invoice line items, financial rows, missionaries, and funds.

#### Scenario: Annual giving statement table

- GIVEN a donor has donations in the statement period
- WHEN the annual statement renders
- THEN the donation repeater outputs each line item
- AND totals are computed from the same resolved rows

#### Scenario: Repeater with totals

- GIVEN an invoice has multiple line items
- WHEN the invoice renders
- THEN each line item appears once
- AND subtotal and total values are computed from the line items

### Requirement: Financial tables

The builder SHALL support data-bound financial tables with grouping, totals,
subtotals, empty states, and page-safe rendering.

#### Scenario: Financial report grouped by fund

- GIVEN a financial report table is grouped by fund
- WHEN report data resolves
- THEN rows are grouped by fund with subtotals
- AND a grand total is rendered according to template settings

#### Scenario: Empty donation period

- GIVEN an annual statement has no donations for the selected period
- WHEN the statement renders
- THEN the configured empty state appears
- AND the system does not show a misleading blank table

### Requirement: Sample and real data preview

The system SHALL allow preview with sample data and authorized real records
after integration with the broader platform.

#### Scenario: Sample receipt preview

- GIVEN staff design a receipt template
- WHEN they request sample preview
- THEN sample organization, donor, donation, and tax data are resolved
- AND no real donor data is exposed

#### Scenario: Unauthorized real data preview

- GIVEN a user lacks permission to view donor financial data
- WHEN they request real record preview
- THEN the system denies the request
- AND no donor data is returned

### Requirement: Binding validation

Templates SHALL validate variables, fallbacks, formatters, conditionals,
repeaters, and table bindings before publish.

#### Scenario: Invalid table binding blocks publish

- GIVEN a financial report table references a missing data field
- WHEN staff attempt to publish
- THEN publish validation fails
- AND the missing field is identified

#### Scenario: Valid bindings proceed to render preflight

- GIVEN a donation receipt template has valid variables and conditionals
- WHEN publish validation runs
- THEN binding validation passes
- AND the template proceeds to rendering preflight
