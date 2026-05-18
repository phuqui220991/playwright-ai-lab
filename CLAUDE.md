# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Playwright + TypeScript test framework for the [Conduit demo app](https://conduit.bondaracademy.com/) (a Medium clone). Covers UI and REST API testing with POM, custom fixtures, Zod schema validation, and tag-based selection.

## Commands

```bash
# install
npm install
npx playwright install              # browsers, first time only

# run
npm test                            # all chromium tests
npm run ui                          # Playwright UI mode
npm run debug                       # debug mode
npm run fullTest                    # all browsers

# tag filters
npm run smoke | sanity | api | regression

# flake hunting
npm run flaky                       # repeat each test 20x

# single test
npx playwright test tests/api/article.spec.ts --project=chromium
npx playwright test -g "Verify Create" --project=chromium

# report
npx playwright show-report
```

Switch env: `ENVIRONMENT=staging npm test` — reads `env/.env.staging`.

## Architecture

**Auth runs once via setup project.** `tests/auth.setup.ts` is matched by the `setup` project in [playwright.config.ts](playwright.config.ts) and listed as a `dependency` of every browser project. It (1) logs in via API and stashes `ACCESS_TOKEN` on `process.env`, then (2) signs in through the UI and writes `.auth/userSession.json`. Browser projects load that file via `storageState`, so UI specs start authenticated. **API specs that need auth read `process.env['ACCESS_TOKEN']`** — only populated when the setup project ran in the same test invocation.

**Two fixture trees merged into one `test` import.** [fixtures/pom/test-options.ts](fixtures/pom/test-options.ts) calls `mergeTests(pageObjectFixture, apiRequestFixture)`. Every spec imports `{ test, expect }` from there and gets both POM page objects (`homePage`, `navPage`, `articlePage`) and the `apiRequest` helper as fixtures. To add a page object: create the class, register it in [fixtures/pom/page-object-fixture.ts](fixtures/pom/page-object-fixture.ts).

**`apiRequest` fixture is the canonical API helper.** Defined in [fixtures/api/api-request-fixtures.ts](fixtures/api/api-request-fixtures.ts), backed by [fixtures/api/plain-function.ts](fixtures/api/plain-function.ts). Signature: `{ method, url, baseUrl?, body?, headers? }`. The `headers` field takes a **token string** (not a header object); the helper wraps it as `Authorization: Token ${headers}`.

**Schema validation with Zod.** Responses are parsed against schemas in [fixtures/api/schemas.ts](fixtures/api/schemas.ts) (`UserSchema`, `ArticleResponseSchema`, `ErrorResponseSchema`). Types are inferred in [fixtures/api/types-guards.ts](fixtures/api/types-guards.ts) (`User`, `ArticleResponse`, `ErrorResponse`).

**Env loading.** [playwright.config.ts](playwright.config.ts) picks `env/.env.${ENVIRONMENT}` (defaults to `.env.dev`) and loads via `dotenv`. Required keys: `URL`, `API_URL`, `USER_NAME`, `EMAIL`, `PASSWORD`. Only `env/.env.example` is tracked.

## Conventions

- **Path aliases:** import via `@pages/*`, `@fixtures/*`, `@test-data/*` — defined in [tsconfig.json](tsconfig.json) `paths`. Use relative `./` only within the same folder.
- **`process.env` access uses bracket notation** (`process.env['API_URL']`) — enforced by `noPropertyAccessFromIndexSignature` in tsconfig.
- **Pages use `baseURL`.** Inside page objects, call `page.goto('/')`, not `page.goto(process.env['URL'])`.
- **Tags** on tests: `@Smoke`, `@Sanity`, `@Api`, `@Regression` (singular). They map to npm scripts via `--grep`.
- **`waitForResponse` pattern.** Attach the listener *before* the action that triggers it; do not wrap both inside `Promise.all` with a function that already awaits internally — invites race conditions. See `tests/clientSite/article.spec.ts` for the canonical form.
- **`tests/clientSite/failingTest.spec.ts` is intentionally failing** — used to verify reporter/CI behavior. Do not "fix" it.

## Notes

- `@types/dotenv` is intentionally not installed — `dotenv` ships its own types.
- `tsconfig.json` has `noEmit: true`; Playwright compiles TS directly. Do not add a build step.
- `strict` plus `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature` are all on. Existing code passes; new code must too.
