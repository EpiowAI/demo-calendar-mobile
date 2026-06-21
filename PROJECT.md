# Demo Calendar Mobile

`EpiowAI/demo-calendar-mobile` is an Expo React Native calendar demo that reads,
creates, and deletes events through the Demo Taskboard event API.

## Lifecycle

- State: `active`
- Layer: `application`
- Machine manifest: [`.doctrine/project.json`](./.doctrine/project.json)

## Goals

- Provide the Expo mobile calendar demo for iOS, Android, and web development
  targets.
- Own the React Native calendar screen, event cards, create-event sheet,
  mobile API client, and React Query hooks.
- Keep the mobile event model compatible with the documented Demo Taskboard
  `/api/events` surface.

## Non-Goals

- This repo does not own the Demo Taskboard web/API service, database schema,
  enterprise doctrine, or shared scheduling platform semantics.
- This repo does not own customer-specific mobile workflows outside this demo.

## Boundary

Demo Calendar Mobile owns only the mobile demo client. It consumes
`EpiowAI/demo-taskboard` through the deployed event API URL in `src/lib/api.ts`;
it must not reach into the web app database, source internals, or deployment
state.

## Public Surfaces

- Expo app manifest: `app.json`
- Mobile entrypoint: `App.tsx`, `index.ts`
- Calendar screen and components: `src/screens/`, `src/components/`
- API client: `src/lib/api.ts`
- Package scripts: `package.json`

## Delivery

No GitHub Actions workflow is present. Production proof for mobile demo changes
is TypeScript/Expo validation, platform launch smoke for the changed target, and
event API compatibility readback against the configured demo endpoint.
