# Music Match

## Features

- Reusable TypeScript libraries with Nx
- NestJS
  - Authentication using passport.js with Redis session management
  - TypeORM with Postgres
  - CRUD actions on all entities
  - Guards
  - Interceptors
  - Services
- Docker compose for redis and NestJS
- Angular
  - Material
  - Dialogs
  - Snackbar notifications
  - Guards
  - Interceptors
  - Services
  - NgRx store actions, effects, reducers and selectors
  - No manual subscriptions/unsubscriptions
- Image upload using Azure Blob Service

## Example redux state

![Example redux state](./images/redux_example_state_cr.png 'Example redux state')

## Login page

![Login page](./images/login.jpg 'Login page')

## Home page

![Home page](./images/home.jpg 'Home page')

## Artist page

![Artist page](./images/artist.jpg 'Artist page')

## Release page

![Release page](./images/release.jpg 'Release page')

## Playlist page

![Playlist with collaborators](./images/playlist_collaborators.jpg 'Playlist with collaborators')

## Search page

![Search page](./images/search.jpg 'Search page')

## Playlist create and update

![Playlist create and update](./images/create_playlist.jpg 'Playlist create and update')

## Adding tracks to a playlist

![Adding tracks to a playlist](./images/add_track.jpg 'Adding tracks to a playlist')

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/getting-started/intro)

[Interactive Tutorial](https://nx.dev/react-tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@music-match/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.
