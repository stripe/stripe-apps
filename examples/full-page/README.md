# Pizzazz Loyalty Program (Stripe Apps Example)

A full-page Stripe App example that demonstrates how to build an app directly in the Stripe Dashboard.

## Overview

This example app showcases a loyalty program called **Pizzazz Loyalty**, featuring:

- A full-page dashboard with member management, rewards, activity tracking, and overview stats
- Detailed member, reward, and transaction pages
- An app settings view
- A home overview drawer

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Stripe CLI](https://stripe.com/docs/stripe-cli) with the `stripe apps` plugin installed
- [pnpm](https://pnpm.io/)

## Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the app locally**

   ```bash
   pnpm start
   ```

   This runs `stripe apps start`, which launches the app in your Stripe Dashboard in development mode.

3. **Build for production**

   ```bash
   pnpm build
   ```

## Other Scripts

| Script           | Description                                   |
| ---------------- | --------------------------------------------- |
| `pnpm lint`      | Run ESLint on all TypeScript source files     |
| `pnpm typecheck` | Type-check the project without emitting files |
| `pnpm test`      | Run the test suite with Jest                  |

## Learn More

- [Stripe Apps Documentation](https://docs.stripe.com/stripe-apps)
