# Deploying Stripe App backends

Stripe App frontends do not need to be deployed by you, as they run on Stripe's
infrastructure. You just need to publish your app to the marketplace and users
will be able to install and see it. App backends are different. At the end of
the day, an App backend is just a web application accessible from the Internet.
Therefore, we need to host it somewhere accessible with a stable web address and
HTTPS support in order to meet the security requirements of Apps.

There's no official hosting platform for Stripe Apps and an innumerable ways to
deploy a web application so this guide will simply go through a few popular
options. For all these examples we will be deploying an example backend that can
save and retrieve plain text notes. Furthermore, we will assume that storage for
the data is accounted for even though in reality you might choose different
storage solutions depending on what platform you're hosting on.

## Heroku

Heroku is an easy-to-use way to host a classic web application that has long
been popular for small projects. Heroku hosts your application in a Linux
container and therefore runs standard NodeJS apps. For this example we'll be
using Express as a web framework but you could use any Node library.

We will assume you have an Express app scaffolded as an NPM project ready to
deploy, as well as a Heroku account. The code of the app would be something like
the following:

```js
// src/index.js
const express = require("express");
const storage = require("./storage");
const PORT = process.env.PORT || 5000;

express()
  .get("/api/:id", (req, res, next) =>
    storage
      .fetch(req.params.id)
      .then((note) => {
        if (note) {
          res.send(note);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(next)
  )
  .put("/api/:id", express.text(), (req, res, next) =>
    storage
      .set(req.params.id, req.body)
      .then(() => res.sendStatus(200))
      .catch(next)
  )
  .use((err, req, res) => {
    console.error(err.message);
    res.sendStatus(500);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
```

Now we need to make sure our `package.json` file declares which version of Node
should run the code in the "engine" field. This is a standard field which is
usually optional but Heroku requires it to know what version of the runtime to
install in our container. Add it like the following:

```json
  "engines": {
    "node": "14.x"
  },
```

The last thing we need is a Procfile. This will tell Heroku what commands to run
to start our application. In our case we don't have any complicated steps so
it's really simple, just create a file named `Procfile` at the root of the
project and give it the following content:

```
web: npm start
```

Replace `npm start` with whatever command starts your particular application.

We can now initialize our project as a heroku app by running `heroku create` (if
you don't have the heroku CLI installed
[follow the instructions on their website](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli)).
Once that is done we can use `heroku local` to run our application locally, make
changes and, once we've committed those changes, deploy the application by
pushing it to heroku with `git push heroku main`.

### Continuous Deployment

Heroku has a
[Git integration](https://devcenter.heroku.com/articles/github-integration) that
can automatically deploy specific branches on GitHub when they are changed. This
avoids the manual "push to Heroku" step above and keeps your deployments in sync
with your code in version control.

## Vercel

Vercel is a hosting platform that combines static file hosting with serverless
functions. For a Stripe Apps backend we will probably only need functions, which
makes the system very easy to set up and scale, as new function invocations will
get automatically created on Vercel's servers as required. However, functions
can suffer from increased latency if they haven't been called in some time (the
"cold start" problem) and the pay-per-execution model might be less economical
than hosting containers depending on your workload.

Vercel uses a custom framework where file paths define routing so for this
server we will have to put our code (in Vercel function format) in a
`/api/[id].js` file, which will be the equivalent of defining an Express handler
on the `/api/:id` route like we did earlier:

```js
// api/[id].js

import * as storage from "../lib/storage";

export default async function handler(request, response) {
  switch (request.method) {
    case "GET": {
      const value = await storage.fetch(request.query.id);
      if (value) {
        response.send(value);
      } else {
        response.status(404).send();
      }
      break;
    }
    case "PUT": {
      await storage.set(request.query.id, request.body);
      response.send();
      break;
    }
    default: {
      response.status(405).send();
    }
  }
}
```

We then just need to install the [Vercel CLI](https://vercel.com/cli), create a
Vercel account and run our project locally by typing `vercel dev` which will
take us through a guided setup before launching the project locally.

### Continuous Deployment

We can deploy our project manually by running `vercel` (for a preview deploy) or
`vercel --prod` (for a production deploy). However, deployments can also be
automatically scheduled whenever a branch is edited by using Vercel's
[GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github).

## Cloudflare Workers

Cloudflare workers are similar to Vercel functions in that you pay per-use and
don't have to worry about scaling them. They are in some ways more limited and
slightly more complicated to use but you get worldwide low-latency edge
deployment and don't suffer from the cold-start problem.

As usual you should start by
[creating a Cloudflare Workers account](https://dash.cloudflare.com/sign-up/workers)
and creating your backend as an NPM package. An easy way to create a Worker is
as a Javascript module that exports an object of event handlers, where the
`fetch` handler is used for HTTP:

```js
// src/index.js
import * as storage from "./storage.js";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    if (pathParts[1] === "api" && pathParts[2]) {
      switch (request.method) {
        case "GET": {
          const value = await storage.fetch(pathParts[2]);
          if (value) {
            return new Response(value, { status: 200 });
          } else {
            return new Response("Not found", { status: 404 });
          }
        }
        case "PUT": {
          await storage.set(pathParts[2], request.text());
          return new Response("OK", { status: 200 });
        }
        default:
          return new Response("Method not allowed", { status: 405 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
```

Then we need to install the Wrangler CLI:

```
npm install -g @cloudflare/wrangler
```

and log in with it

```
wrangler login
```

We'll need to create a `wrangler.toml` file to tell Wrangler how to deploy our
code. It should look like this:

```toml
name = "cloudflare-test"
type = "javascript"

account_id = "<your account id>"
workers_dev = true
route = ""
zone_id = ""
compatibility_date = "2022-03-24"

[build.upload]
format = "modules"
dir = "./src"
main = "./index.js" # becomes "./src/index.js"

[[build.upload.rules]]
type = "ESModule"
globs = ["**/*.js"]
```

To get your account ID you can use the CLI, just run

```
wrangler whoami
```

Once that's done you should be able to run your backend locally with
`wrangler dev` and deploy it with `wrangler publish`.

### Continuous Deployment

Cloudflare provides a
[GitHub action](https://github.com/marketplace/actions/deploy-to-cloudflare-workers-with-wrangler)
for deploying Workers automatically when a branch is modified. Configuring it
requires a bit more knowledge of GitHub Actions than the automatic integrations
of other platforms but that also makes it very flexible.

## DigitalOcean (or other private web servers via SSH)

A DigitalOcean Droplet provides you with a web server completely under your
control. As such, deploying your backend to DigitalOcean is similar to deploying
on your own machine. This means it is a very flexible solution but also a more
complex platform to configure and scale.

This documentation won't serve as a step-by-step guide to creating and
connecting to a droplet, but will instead be a high-level overview of how to
deploy your backend to a droplet. The same steps also apply to private servers
accessible by SSH from a different provider, or even computers hosted
on-premises.

Links to DigitalOcean documentation will be provided in order to help you get up
and running with your new server.

One thing to note, in order to use your backend with SSL — which is required for
Stripe Apps — you will need to purchase a URL and point the DNS to
DigitalOcean's nameservers, or create a self-signed certificate on the server
(droplet) itself.

### Getting Started

To get started with your DigitalOcean deployment, you will need to create a new
droplet. This will be your server. If you haven't created an account, you'll
have to do that first.

Once you're in your account and at the dashboard, click **create** at the top
and select **droplets**.

Please reference DigitalOcean's documentation on
[creating a droplet](https://docs.digitalocean.com/products/droplets/how-to/create/).
There are a lot of different options to consider when creating your droplet, but
the DigitalOcean docs will walk you through that.

When your droplet is created, go ahead and connect to it via SSH, see
[docs](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/)
to learn about connecting via SSH.

### Clone your repo

Now that we are in, we can go ahead and clone our backend server right into our
current directory (you may have to add your GitHub credentials. See this
[tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-20-04)).

Once we have our repo cloned, we can start our server by navigating into our
project and starting the server the same way we would if we were working on our
own machine.

Some packages you may have to install yourself are:

- Node
- pm2 (optional) - [docs](https://www.npmjs.com/package/pm2).

### Configure NGINX and Node

Because this deployment documentation touches on numerous different aspects of
deploying to DigitalOcean, please refer to this
[DigitalOcean tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)
on setting up a Node application on a DigitalOcean droplet which covers multiple
different concepts.

It will show you how to configure NGINX to listen on the appropriate port and
set it up as a reverse proxy to your Node application. It will also touch on how
to use PM2 to easily manage your running Node processes.

### Continuous deployment

It is possible to script the steps needed to SSH onto the server, pull the
latest code and restart the Node applications using GitHub Actions or another CI
service that is triggered by certain branches being modified. Because there's no
standard way to achieve this, you should consult the documentation of your CI
platform.
