# Realtime Playground and Test Runner

Sandbox playground for manual and E2E tests run in browser and on mobile.

### Playground

<img src="./docs/playground.png" alt="screenshot_playground" width="600" />

### Test Runner in browser

<img src="./docs/test_runner.png" alt="screenshot_test_runner" width="600" />

### Test Runner on mobile

<img src="./docs/mobile.png" alt="screenshot_mobile" width="300" />

## Structure

- `apps/next`: Next.js playground and test runner UI
- `apps/expo`: Expo playground and test runner UI
- `packages/realtime-core`: shared realtime controller, collectors, types, and schemas
- `packages/tests`: shared realtime test suites and test runner helpers

## Installation

1. Copy `example.env` to `.env`
2. Run `pnpm install`

3. Run web, mobile or both apps

```bash
pnpm web # runs web dev client
pnpm ios # runs ios mobile client
pnpm android # runs android mobile client
pnpm dev # runs both web and mobile servers and starts ios simulator
```

Both `apps/next` and `apps/expo` load environment variables from the repo root `.env`.

## Change project secrets

To change secrets in order to test different project use `Test Settings` on mobile or browser

<img src="./docs/test_settings_mobile.png" alt="test_settings_mobile" width="400" />

<img src="./docs/test_settings_web.png" alt="test_settings_mobile" width="400" />
