# playwright-ai-lab

Learning Playwright automation from scratch to advanced — AI-assisted development, scalable test architecture, CI/CD, API testing, and best practices for QA engineers.

Tests target the [Conduit demo app](https://conduit.bondaracademy.com/) (a Medium clone).

## Stack

- Playwright + TypeScript
- Page Object Model
- Custom fixtures (POM + API)
- Zod schema validation for API responses
- `dotenv` for per-environment config
- Tag-based test selection (`@Smoke`, `@Sanity`, `@Api`, `@Regression`)

## Project layout

```
env/                       # .env.dev, .env.staging (gitignored), .env.example
fixtures/
  api/                     # apiRequest fixture, Zod schemas, types
  pom/                     # POM fixture + merged test-options
pages/clientSite/          # Page objects (homePage, navPage, articlePage)
test-data/                 # JSON fixtures
tests/
  auth.setup.ts            # API login + storage state seeding
  api/                     # API specs
  clientSite/              # UI specs
playwright.config.ts
```

## Setup

```bash
# 1. install deps
npm install

# 2. install browsers (first time only)
npx playwright install

# 3. create your env file
cp env/.env.example env/.env.dev
# then edit env/.env.dev with a real Conduit account
```

## Running tests

```bash
npm test                # all chromium tests
npm run ui              # Playwright UI mode
npm run debug           # debug mode
npm run fullTest        # all browsers (chromium, firefox, webkit)

# tag-filtered runs
npm run smoke           # @Smoke
npm run sanity          # @Sanity
npm run api             # @Api
npm run regression      # @Regression

# flake hunting
npm run flaky           # repeat each test 20x
```

Switch environments with `ENVIRONMENT`:

```bash
ENVIRONMENT=staging npm test
```

View the HTML report after a run:

```bash
npx playwright show-report
```

## How auth works

`tests/auth.setup.ts` is a Playwright **setup project**. It logs in via the API, saves the browser storage state to `.auth/userSession.json`, and is declared as a `dependency` of every browser project. All UI tests start authenticated automatically.

## Notes

- `.auth/` and `env/.env.*` are gitignored; only `env/.env.example` is tracked.
- The `failingTest.spec.ts` file is intentionally failing — used to verify reporter/CI behavior.
