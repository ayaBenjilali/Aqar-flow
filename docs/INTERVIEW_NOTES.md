# Interview Notes

## What AqarFlow Shows

AqarFlow demonstrates a multi-role marketplace interface for real estate. The same application adapts to buyers, independent agents, and companies while keeping navigation consistent.

The implementation focuses on front-end architecture, routing, stateful services, responsive UI, RTL support, and realistic product flows.

## Architecture Decisions

- Standalone Angular components keep feature modules lightweight.
- Mock services expose observable data so the UI behaves like an API-backed product.
- Permissions are role-based and used directly in the navigation and action surfaces.
- The main shell uses regular page scrolling to avoid mobile web lock-in issues from native-style containers.
- Ionic components are used where they help with polished controls, but layout is handled with SCSS for better desktop behavior.

## Tradeoffs

- Data is local and deterministic, which makes the demo reliable but not production-backed.
- Authentication is simulated to show role-specific flows quickly.
- Images use remote URLs to keep the repository lightweight.
- The UI prioritizes marketplace and CRM flows over checkout, payment, or contract signing.

## Good Next Technical Steps

- Add a backend API with persisted listings, users, leads, and messages.
- Add file upload for property media.
- Add test coverage for permissions, search filtering, and CRM state transitions.
- Add CI and preview deployments for pull requests.
