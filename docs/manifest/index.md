## App Manifest

Every Stripe App needs a manifest file `app.json` at the root of the apps directory structure.

\
Example:
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

