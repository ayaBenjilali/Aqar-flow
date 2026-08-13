# AqarFlow

AqarFlow is an Arabic-first real estate marketplace prototype built with Angular, Ionic, and Capacitor. It provides a unified experience for buyers, independent agents, and agency companies, including property discovery, favorites, messaging, lead tracking, profile management, and a lightweight CRM dashboard.

Designed for:
- 🌐 Web
- 📱 Android
- 🍎 iOS
The project is structured as a cross-platform portfolio application with a mobile-first, responsive UI and full RTL support. It uses mock services and local state so the complete user experience can be explored without a backend.

## Live Demo

The application is deployed on Vercel:

```text
https://aqarflow-one.vercel.app/
```

## Highlights

- Arabic-first RTL interface with language direction support.
- Role switching between buyer, agent, and company experiences.
- Property search, featured listings, favorites, and detail pages.
- Agent/company dashboards with CRM-style lead management.
- Messaging, notifications, profile, and property creation flows.
- Responsive layout for desktop and mobile.
- Ionic UI primitives with Angular standalone components.
- Capacitor configuration for mobile packaging experiments.

## Tech Stack

- Angular 19
- Ionic Angular 8
- RxJS
- Capacitor
- TypeScript
- SCSS
- ESLint

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open locally:

```text
http://127.0.0.1:4300/app/home
```

If the port is already in use:

```bash
npx ng serve --host 127.0.0.1 --port 4301
```

## Quality Checks

```bash
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npx ng build --configuration development
```

For production deployment:

```bash
npx ng build --configuration production
```

## Demo Roles

Use the role switcher in the top navigation:

- Buyer: search, compare, save properties, and contact agents.
- Agent: create listings, manage leads, and respond to messages.
- Company: view team-oriented CRM and portfolio workflows.

## Deployment

The app can be deployed as a static Angular build. Vercel should use:

- Framework preset: Angular
- Build command: `npm run build`
- Output directory: `dist/aqarflow/browser`

## Mobile Apps

AqarFlow is prepared for Android and iOS through Capacitor. The home page also includes visible mobile-readiness indicators so the native version is easy to identify during phone testing.

Create or update the native projects:

```bash
npm install
npx cap add android
npx cap add ios
npm run cap:build
```

Open Android Studio:

```bash
npm run android
```

Open Xcode on macOS:

```bash
npm run ios
```

After every web change, run:

```bash
npm run cap:build
```

## Project Structure

```text
src/app/core       domain models and services
src/app/features   routed product areas
src/app/shared     reusable UI components
src/styles.scss    global layout and theme system
docs               project notes and roadmap
```

## Current Scope

This is a front-end portfolio implementation. Data is seeded locally through services, and authentication is represented with demo sessions. A production version would connect these flows to a real API, file storage, analytics, and server-side authorization.
