<div align="center">
  <a href="https://github.com/stripe/stripe-apps/examples/crm-full-stack">
    <img src="logo.png" alt="Logo" width="80" height="80">
  </a>

  <h2 align="center">CRM Buddy</h2>

  <p align="center">
    Example on how to create a Full Stack Stripe App with a Node.js Backend API server and Postgres DB.
    <br />
    <a href="https://www.loom.com/share/e7332c3a89a84333b1bd7333d1fa3907">View Demo</a>
    <br />
    <a href="https://www.saasbase.dev/build-a-stripe-app-with-typescript-and-node-js-part-1/">Step by Step tutorial</a>
    ·
     <a href="https://stripe.com/docs/stripe-apps">Stripe Docs</a>
     .
    <a href="https://www.saasbase.dev">Built by SaaSBase</a>
  </p>
</div>

<p>
    <br />
    </p>

![Screenshot](https://www.saasbase.dev/content/images/size/w1600/2022/07/Screen-Shot-2022-07-09-at-1.15.00-PM.png)

<p>
    <br />
    </p>

## About the project

This example shows how you can set up a full stack Stripe App called CRM Buddy that helps business owners leave sales notes on their customers. This helps them build a better connection with their clients.

The app lets them:

- On the Dashboard: View all recently added notes for all customer
- On the Customer screen: View all the previously added notes
- On the Customer screen: Add a new note for that customer

### Stack

- Typescript
- Node.js
- Postgres
- Prisma ORM

## Getting started

### Prerequisites

1. Install Postgres locally - [for Mac](https://postgresapp.com/) and [for Windows](https://www.postgresql.org/download/windows/)
2. Node.js
3. Stripe CLI with Stripe apps configured

### Installation

### Running the Node.js Backend API:

1. Install and run the backend API with:

```
cd nodejs-backend
yarn
```

2. Create a `.env` in the project and add your Postgres DB:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crmbuddy
```

3. Run the app:

```
yarn run dev
```

### Running the Stripe App:

```
cd stripe-app
yarn
yarn run dev
```
