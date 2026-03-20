# Realtime Playground monorepo

![screenshot](./docs/screenshot.png)

## Structure

- `apps/next`: current Next.js playground app
- `apps/expo`: placeholder for a future Expo app
- `packages/tests`: placeholder for future shared test utilities

## Installation

1. Copy `example.env` to `.env`
2. Run `yarn install`
3. Run `yarn workspace @realtime-playground/next dev`

Both `apps/next` and `apps/expo` load environment variables from the repo root `.env`.
