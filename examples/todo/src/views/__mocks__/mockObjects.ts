import Stripe from 'stripe';

export const customer: Stripe.Customer = {
  "id": "cus_LDYxoj3NO44acv",
  "object": "customer",
  "address": null,
  "balance": 0,
  "created": 1645811007,
  "currency": null,
  "default_source": null,
  "delinquent": false,
  "description": null,
  "discount": null,
  "email": null,
  "invoice_prefix": "8CC4AC2F",
  "invoice_settings": {
      "custom_fields": null,
      "default_payment_method": null,
      "footer": null,
  },
  "livemode": false,
  "metadata": {
      "todos": "[{\"text\":\"item\",\"created\":1646155247350,\"completed\":false,\"notes\":\"\"},{\"text\":\"item 2\",\"created\":1646155303351,\"completed\":false,\"notes\":\"\"}]"
  },
  "name": null,
  "next_invoice_sequence": 1,
  "phone": null,
  "preferred_locales": [],
  "shipping": null,
  "tax_exempt": "none",
  "tax_ids": {
      "object": "list",
      "data": [],
      "has_more": false,
      "url": ""
  }
}
