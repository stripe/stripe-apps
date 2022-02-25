|                                                                                                                                                                  | Is rubric item gating? | The app passes this requirement if…                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | The app fails this requirement if…                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Product**                                                                                                                                                 |         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **What problem are you trying to solve?**                                                                                                                    | Y       | There is a clearly articulated user problem that this app solves using concrete language. <br><br><br><br>`Ex. Currently Support Agents have to flip back and forth between the Stripe and Zendesk dashboard. This is a tedious process and can quickly lead to errors. By bringing support ticket information into the Stripe Dashboard, Support specialists will be able to quickly resolve tickets in one view, with fewer errors.`                                                                                                                                                                                               | The problem the app is trying to solve is not clear.<br>The app is trying to solve too many problems for its first version.<br>The statement is focused on the solution, not the problem.<br><br>`Ex. The Cactus Practice app is going to help users streamline their workflows, increase their output, and reduce dependencies.` <br>Issues: Vague, jargon-y words are used to describe the what they will solved. Not listing a problem but the solution.                                                                                                                                                                                                                                                                    |
| **Who are you trying to solve this problem for?**                                                                                                                    | Y       | There is a clear, specific user or set of users that aligns with one of the following user types (ordered by user volume):<br><br>1. SMBs<br>2. Startups<br>3. Growth & Enterprise<br><br>`Ex. This Zendesk app will be focused on improving workflows for Support Specialists that use the Stripe Dashboard.`                                                                                                                                                                                                                                                                                                                       | There is no user or a non-specific user the app is trying to solve for.<br>The app is solving for a non-dashboard user.<br><br><br><br>`Ex.  The Cactus Practice app is going to help users streamline their workflows, increase their output, and reduce dependencies.` <br>Issues: Did not list a specific user type.                                                                                                                                                                                                                                                                                                                                                                                                        |
| **How does this app solve the user’s problem?**                                                                                                                      | Y       | There are clearly articulated workflows, capabilities, and features that solve the users problem. <br><br><br>`Ex. The Zendesk app will allow users to:`<br><br>- `Find a specific ticket and view the ticket history`<br>- `Be able to take common actions such as claim, respond, and close a ticket`<br>- `Find a specific customer and view their ticket history`                                                                                                                                                                                                                                                                | There are no clear workflows, capabilities, or features.<br>The workflows, capabilities, or features listed don’t solve the stated user problem statement.<br><br>`Ex. The Cactus Practice app is going to help users streamline their workflows, increase their output, and reduce dependencies.` <br>Issues: Workflows are too vague, not clear what the user will be able to accomplish.                                                                                                                                                                                                                                                                                                                                    |
| **Does the app violate any parts of our terms of service?**<br>_Note: This will be checked more extensively at App Review._                                            | N       | The app complies with Stripe’s Terms of Service.<br><br><br><br><br>`Ex. The Zendesk app is pulling in user support tickets. It is not importing any content that violates our current terms of service.`                                                                                                                                                                                                                                                                                                                                                                                                                            | The app is surfacing content or data that breaks Stripe’s Terms of Service.<br>The app exhibits crude, derogatory, or discriminatory themes or messages. <br><br>`Ex. The app will pipe in data from our company's internal system that tracks gun sales.`<br>Issues: Stripe does not support drug sales at this time.                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Are there any apps similar to this app available on the Stripe marketplace?**                                                                                      | N       | The app is unique, there is no other app like it in the marketplace.<br>The app is similar but not identical to other app(s) in the marketplace. <br><br>`Ex. Zendesk wants to create an app that allows Support Specialists to see their open support tickets in the Stripe Dashboard. While Hubspot has a similar product under the support category, there is enough distinction between the two services to support both in the marketplace.`                                                                                                                                                                                    | The app is an exact replica of an app that already exists in the marketplace (e.g copying the Dropbox app experience but changing the app name and logo).<br><br><br>`Ex. The submission is for an app, CalmDesk, which pipes support tickets from its platform in to the Stripe Dashboard. The logo looks remarkably similar o the Zendesk logo.`<br>Issues: This app resembles Zendesk to closely                                                                                                                                                                                                                                                                                                                            |
| **Do you have a plan in place for how to handle support requests from users once the app goes live in the Stripe Marketplace?**                                      | N       | There is a clear plan for support in place. The company / developer has the time and resources to take on a growing amount of users.<br><br><br><br>`Ex. Our developer, Dan, along with 4 people from our Support team will be on call once the app launches. Once we hit 4k+ users we will scale up our support.`                                                                                                                                                                                                                                                                                                                   | There are no plans to support users who need help.<br>There is likely a large user base, and the developer / company support plan will clearly not scale to cover it all.<br>Once released, there will be no one maintaining or monitoring app.<br><br>`Ex. We have not thought about how we will support this app. If we get a large number of users, we'll start thinking about a plan.`                                                                                                                                                                                                                                                                                                                                     |
| **Design**                                                                                                                                                      |         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **When moving from a core dashboard experience (i.e. customer detail page) to the App Drawer, will users feel like they are using the same product?**                | Y       | The app feels like a natural addition to the Stripe Dashboard experience and ecosystem. The app is solely using Stripe UI components. Colors, typography, copy, spacing, and tone feel unmistakably like Stripe. <br><br><br><br><br>`Ex. The app is using Stripe UI components to a tee. The experience looks like it could have been built by a Stripe.`                                                                                                                                                                                                                                                                           | The app is using a mix of Stripe UI components and bespoke components.<br>The app isn’t using Stripe UI components.<br>The colors, typography, copy, spacing, and tone do not match the Stripe brand.<br>Components are not being used as intended (as outlined in UI Toolkit).<br><br>`Ex. The app mocks are using Stripe UI components but they also include net-new components that aren't available in coded UI Toolkit (i.e Stripe Support chat widget).`<br>Issues: The app is using non-Sail components.                                                                                                                                                                                                                |
| **Does the app account for core experiences such as onboarding, product authentications, key workflows that address user needs, and app settings?**                 | Y       | Once the user has installed the app there are clear instructions for how to get started, it is intuitive or explained how to use the the key workflows.<br><br>`Ex. As a first time user I was able to get started easily with little to no friction. It was clear what workflows and actions were available to me.`                                                                                                                                                                                                                                                                                                                 | The app doesn’t have a getting started experience.<br>It’s not clear how to get to or use the key flows in the app.<br><br><br>`Ex. After installing the app I wasn't clear on what to do next. There we no calls to action on the apps landing page.`<br>Issues: The user is stuck and isn’t clear what to do next, which renders the app unusable.                                                                                                                                                                                                                                                                                                                                                                           |
| **Does the experience integrate with one of supported Stripe Dashboard pages (list view, detail view, etc.)?**                                                       | Y       | The App Drawer is only shown as interactive (openable) on one or more of the designated dashboard eligible pages. <br>The App Drawer content is relevant to the page its open on.<br><br>`Ex. The ZenDesk app mocks show the App Drawer opening over dashboard.stripe.com:`<br><br>- `/payments/detaill → shows support content relevant to that specific payment`<br>- `/customers → shows support content relevant to customer`                                                                                                                                                                                                    | The content within the App Drawer is not relevant to any of the designated dashboard eligible pages.<br>The app mocks have the App Drawer opening over a page that is not a dashboard eligible pages.<br><br>`Ex. The Cactus Practice app mocks show the App Drawer opening over dashboard.stripe.com:`<br><br>- `/quote`<br>- `/customer/[customer+id]`<br><br>Issues: The mocks are opening up over pages that do no t trigger the App Drawer.                                                                                                                                                                                                                                                                               |
| **Can the user easily navigate from surface to surface without hitting any points of friction? Does the app orient the user to where they are within the app’s IA?** | N       | There’s little to no friction navigating from surface to surface; there is a clearly defined path for how users should move through an experience and across key workflows. <br>There are no dead-ends ends or looping experiences.<br>Signposting (like tabs, breadcrumbs, etc.) help the user understand where they are with the apps IA.<br><br>`Ex. I was able to easily to bounce around from workflow to workflow. I understood where I was within the product IA the whole time I was testing the prototype. When I needed to back-out pf a workflow, I was able to use the breadcrumbs to get back the the app's main page.` | The end to end experience feels disjointed.<br>It’s not clear how or there’s no way how to get from one surface to the next. there’s friction when navigating from one step in a flow to the next.<br>There are dead ends and looping experiences.<br><br><br>`Ex. I was in the middle of a workflow and needed to exit out. It was clear how I got back to the main content; there was no cancel or previous button nor was there a breadcrumb to go back a step.`<br>Issue: Flow just accounts for the happy path; doesn’t allow people to go back or deviate from the path forward.                                                                                                                                         |
| **Does the app account for unhappy paths?**                                                                                                                          | N       | The app has accounted for all error states, loading states, and other edge cases.<br><br>`Ex. When filling out a form in the Zendesk app, I click next and see that there are errors with how the form was filled out. All errors are clearly highlighted with plain language explaining what the error is and how to fix it.`                                                                                                                                                                                                                                                                                                       | The app has neglected to include error states or error states are not clear.<br><br>`Ex. The user tries to click the 'Next' button in a workflow but nothing happens. The user has hit an error but its not obvious because there is no error message.`<br>Issue: The partner hasn’t specified an error message  or thought about the non-happy path.<br><br>`Ex. The user tries to click the 'Next' button in a workflow and sees the following error message: 'Error code: 471'.`<br>Issue: The user gets an error message after taking an action but its not clear what the error is and how to resolve it.                                                                                                                 |
| **Does this app share unnecessary information with users?**                                                                                                          | N       | The app is only sharing information with users that is relevant to the app experience. <br>The user is only receiving a total of 0-2 messages (notifications, emails) from the partner a week about the app. <br><br><br><br><br><br>`Ex. When going through a workflow in the Zendesk app, as a user I only encounter key workflow--there are no ads distractions, and extraneous information that appears throughout the app.`                                                                                                                                                                                                     | The app contains ads, promotions, and/or unsolicited messaging (notices, notifications, emails) to the user that are not required for using this app. <br>The partner is using the app as an opportunity to upsell additional paid-for features within their product, that are not available within the app.<br>The partner is using the app as an opportunity to market or promote other products in their suite. <br><br>`Ex. Once the user installs the app, the first thing they see is a notice being used as an ad to promote Cactus Practice's latest paid for product, the Prickly Pear.`<br>Issue: Instead of onboarding the user to the app, the partner is trying to divert their attention to other paid products. |
