## ph-municipalities / archives

This branch contains a **static snapshot** of the PAGASA 10-Day Weather Forecast Excel files (`day1.xlsx` – `day10.xlsx`), downloaded on **August 22, 2025** before PAGASA discontinued public access.

### Purpose

- Serves as a permanent reference copy of the Excel files that were the original data source for this project.
- Provides stable **fixtures** for tests and debugging ([Issue #156](https://github.com/ciatph/ph-municipalities/issues/156)).
- Preserves historical context for contributors after the migration to the [PAGASA TenDay API](https://tenday.pagasa.dost.gov.ph/docs).

### Notes

- This branch is **archival only** and will not receive ongoing updates.
- Tests in the main branch may reference these files via raw GitHub URLs.
- Do not merge this branch into `master`; it is maintained separately for archival purposes.

@ciatph<br>
20250824
