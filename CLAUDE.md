# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Bahmni Appointment Scheduling frontend module — a **hybrid Angular 1.5 + React 16** application. Angular handles routing and legacy views; React (with Redux) powers newer UI components. They integrate via the `react2angular` adapter.

## Commands

All commands run from the repo root unless noted.

```bash
# Install dependencies
npm install
cd ui && npm install

# Build
npm run build           # React + webpack (development)
npm run bundle          # React + webpack (production)

# Test
npm run test            # Run all tests (React + Angular)
npm run test-react      # React/Jest tests only
npm run test-angular    # Angular/Karma tests only

# Single React test file
cd ui && npx jest path/to/component.spec.js

# Single React test by name
cd ui && npx jest --testNamePattern="test description"

# Watch mode (React)
cd ui && npm run test-react-watch

# Storybook
cd ui && npm run storybook
```

## Architecture

### Directory Structure

- `src/` — Angular application
  - `controllers/` — Angular controllers (admin, manage/calendar, manage/list views)
  - `services/` — Angular services (appointments, speciality, calendar)
  - `directives/` — Custom Angular directives (validators, pickers, search)
  - `models/` — Data models (appointment, service)
  - `views/` — Angular HTML templates
  - `styles/` — SCSS organized by domain
  - `app.js` — Angular module and route/state config (ui-router)
  - `init.js` — Entry point; imports all modules and bootstraps Angular

- `ui/react-components/` — React application
  - `components/` — 50+ UI components (appointments, services, providers, etc.)
  - `utils/` — Utility functions and custom hooks
  - `mapper/` — Data transformation (API response → component props)
  - `appointment-request/` — Appointment request workflow
  - `__mocks__/` — Jest manual mocks

- `test/` — Angular/Karma/Jasmine tests
  - `support/` — Test helpers, object mothers, mock specs

### State Management

React components use Redux with redux-thunk for async actions. The store structure follows feature slices (appointments, providers, services, etc.).

### API Integration

HTTP calls are made via **axios** in service files within `ui/react-components/`. The Angular side uses its own `$http`-based services in `src/services/`.

### React ↔ Angular Bridge

React components are registered as Angular components using `react2angular`. See `src/init.js` for registration. This allows React components to be used in Angular templates.

### Key Dependencies

- **Carbon Design System** (`@carbon/react`, `@carbon/icons-react`) — primary React UI library
- **FullCalendar 2.7.3** — calendar views (Angular side)
- **rc-calendar, rc-time-picker** — date/time pickers (React side)
- **react-select, react-tabs** — form controls
- **moment.js** — date/time manipulation
- **react-intl** — i18n for React components; translation strings in `i18n/`

## Testing

- React tests: **Jest 24** with `@testing-library/react`. Test files colocated with components as `*.spec.js` or `*.test.js`.
- Angular tests: **Karma + Jasmine**. Test files in `test/` directory as `*spec.js`.
- Angular test helpers/factories live in `test/support/`.

## Node Version

Requires Node **>=14 <19** (see `engines` in root `package.json`).
