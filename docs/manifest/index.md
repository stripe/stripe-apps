## App Manifest

Every Stripe App needs a manifest file `app.json` at the root of the apps directory structure.


### app.json example
```
{
  "id": "com.shippo.invoicing",
  "version": "1.2.3",
  "name": "Shippo Shipment Invoicing",
  "icon": "./shippo_icon_32.png",
  "permissions": [{
    "permission": "invoice_write",
    "purpose": "Allows Shippo to add shipping line items to an invoice.",
  }, {
    "permission": "product_read",
    "purpose": "Allows Shippo to use product sizes for calculating shipping."
  }],
  "app_backend": {
    "webhooks": [{
      "path": "https://example.com/my/webhook/adjust_shipment_rates_for_new_size",
      "enabled_events": [
        'product.updated',
      ],
    }],
  },
  "custom_objects": {
    "stripe.invoice": {
      "field_name": "shipment",
      "friendly_name": "Shippo shipment",
      "render_definition": {
        "render_type": "foreign_key",
        "foreign_key_field": {
          "formatter": "number",
          "precision": 0,
        },
      },
    },
  },
  "ui_extension": {
    "views": [{
      "viewport": "dashboard.invoice.detail_page.main_content",
      "component": "AddShipping",
    }],
    "actions": [{
      "function": "popup_shipping_rate_selector",
      "object": "stripe.invoice",
    }],
    "content_security_policy": {
      "connect-src": [
        "https://shippo-static.s3.amazonaws.com/providers/*",
        "https://api.goshippo.com/"
      ],
      "image-src": [], // Potential future extension
      "purpose": "These urls allow the app to contact shippo for creating shipping details and for loading images of shipping partner logos"
    }
  }
}
```



## Schema

`app.json`
| Field name                | Type                           | Description                                                                                                                                                                                     | P  | Examples                  |
| ------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -- | ------------------------- |
| `id`                      | `slug`                         | [discussion ongoing] A globally unique identifier for the application, chosen by the developer and validated upon initial submission                                                            | P0 |                           |
| `version`                 | `string`                       | A user-defined version. Developers are free to give version identifiers in whatever way they see fit, Stripe will have an internal version ID as well for each submission.                      | P0 | `1.2.4`, `dce9648`        |
| `name`                    | `string`                       | The name of the app to show in the UI when referring to the app                                                                                                                                 | P0 | `Zendesk`, `Churnbuster™` |
| `icon`                    | `string`                       | The relative path within the app bundle to a NxN icon to show alongside attribution                                                                                                             | P1 | `./favicon.png`           |
| `permissions`             | `Array<``PermissionRequest``>` | What permissions does the application need in order to function? In the future there may be another “optional” permissions field that the application knows how handle if they are not granted. | P0 |                           |
| `app_backend`             | `AppBackendManifest`           | Configuration specific to the “App Backend” capability                                                                                                                                          | P0 |                           |
| `ui_extension`            | `UiExtensionManifest`          | Configuration specific to the “UI Extension” capability                                                                                                                                         | P0 |                           |
| `custom_objects``_schema` | `CustomObjectsSchema`          | [speculative] Schema for “Custom Objects” or “Structured Metadata” or whatever we end up calling our data store.                                                                                | P2 |                           |

`PermissionRequest`

| Field name   | Type                           | Description                                                                                  | Examples                                                                 |
| ------------ | ------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `permission` | string                         | A RAK permission that the extension would like to use                                        | `customer_write`, `balance_read`                                         |
| `purpose`    | string | `Map<locale, string>` | An explanation to be shown to the user for why the extension needs the requested permission. | “Necessary for Shippo to update invoices with selected shipping charges” |

`CustomObjectsSchema`

This is very much TBD but is currently based off the paused Structured Metadata work.

| Field name     | Type               | Description                                                                            | Examples                                                                                             |
| -------------- | ------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `<ObjectType>` | `SchemaDefinition` | The schema of data provided by the application and stored with Stripe per `ObjectType` | `ObjectType` can be a stripe object (`stripe.customer`) or a new object for the app (`zendesk.case`) |

`SchemaDefinition`
This mirrors the API for defining schema in our structured metadata service. This isn’t well-considered yet, but here’s a potential example.


    
          "stripe.customer": [
            "field_name": "total_case_count",
            "friendly_name": "Total case count",
            "render_definition": {
              "render_type": "number",
              "number_field": {
                "formatter": "number", // as opposed to "percent" or "financial"
                "precision": 0,
              },
            },
            // "Last contacted" and "Avg support CSAT" also added here
          ]
        }


`AppBackendManifest`
| Field name | Type                       | Description                                                                  | Examples         |
| ---------- | -------------------------- | ---------------------------------------------------------------------------- | ---------------- |
| `webhooks` | `Array<``WebhookConfig``>` | Configures endpoints for the application just like one would through the API | See the API docs |

`UiExtensionManifest`
| Field name                | Type                        | Description                                                                                                                                                                                                                                                                                                                                                              | Examples                                                                                                                          |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `views`                   | `Array<``ViewManifest``>`   | React components that show up in the Dashboard in a distinct place. All views are clearly marked as extensions with attribution to the developer and a way to get help from them.<br><br>`Viewport` is an identifier provided by the Bento platform that indicates where an extension may appear within the Dashboard.                                                   | `{"invoices.detail_page.main_content": "``AddShippoRates"``}`<br>`{"products.detail_page.main_content": "ConfigureFullfillment"}` |
| `actions`                 | `Array<``ActionManifest``>` | Actions are buttons or menu items that trigger one of three things:<br><br>- Navigation to a different page<br>- Call a JS function that does work in the background (and updates the button state / displays Toasts as appropriate)<br>- Opens a view in a modal or a drawer<br><br>`ObjectType` is a stripe or custom object type that this action can be attached to. | `{create_case: 'stripe.customer'}`, <br>`{close_case: 'zendesk.case'}`                                                            |
| `content_security_policy` | `CSPRequest`                |                                                                                                                                                                                                                                                                                                                                                                          |                                                                                                                                   |
| `uses`                    | `Array<string>`             | [speculative] Platform capabilities provided by the Dashboard or the browser that the plug-in uses.                                                                                                                                                                                                                                                                      | `localStorage`, `location`                                                                                                        |

`ViewManifest`
Since views are themselves a declarative language (React), there’s a tension between what we put in the manifest and what we encode in the plugin framework. We take the stance that anything that’s a “view concern”, ie it will be displayed to users, belongs as a property on the `*View` React components. This configuration is the minimal information necessary to allow the product surface (ie the Dashboard) to embed and initialize the extension.

| Field name  | Type     | Description                                                                                                                   | Examples                    |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `viewport`  | `string` | `Viewport` is an identifier provided by the Bento platform that indicates where an extension may appear within the Dashboard. | `dashboard.invoice.details` |
| `component` | `string` | Exported React component that is one of our *View components.                                                                 | `AddShippingSelector`       |

`ActionManifest`
“Actions” allow users to hang jumping off points onto Stripe objects and potentially custom objects in the Dashboard. They are the only way for extensions to appear in list views and detail headers.

| Field name    | Type     | Description                                                                          | Examples                          |
| ------------- | -------- | ------------------------------------------------------------------------------------ | --------------------------------- |
| `function`    | `string` | An exported function that conforms to the “action” interface.                        | `create_case`, `close_case`       |
| `object_type` | `string` | `object_type` is a stripe or custom object type that this action can be attached to. | `stripe.customer`, `zendesk.case` |

`CSPRequest`

| Field name    | Type                           | Description                                                                                                                                               | Examples                                                                                                                                                      |
| ------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `connect-src` | Array<string>                  | URLs that comply to the CSP spec. We will be more restrictive than the spec in that we’ll only allow HTTPS schemes (amongst other potential limitations). | `https://api.shippo.com/*`, `https://o0.ingest.sentry.io/api/`                                                                                                |
| `purpose`     | string | `Map<locale, string>` | An explanation to show users when the app is installed that explains why the plugin needs to communicate directly with these URLs                         | “The Shippo app sends data to the Shippo service to provide its functionality and sends anonymous error reports to our partner Sentry for debugging purposes” |

### Versioning

The schema of this file is versioned along with the SDK and client that created it. There will be a single version number that will represent a release of the app platform SDK that this is part of. Details on how that will work will appear in an upcoming proposal and are outside of the scope of this document.

### Configuration outside of the tailor.json file

There’s a lot of additional information we need in order to properly display the app that isn’t required for the app itself to function and should be surfaced through an API that’s friendlier to non-developers.

Examples:

- `description`
- `tagline`
- `keywords`
- `hero_images`
- `supported_countries`
- `supported_locales`
- etc