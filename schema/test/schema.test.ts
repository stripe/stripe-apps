import Ajv2019 from "ajv/dist/2019";
import addFormats from "ajv-formats";
import schema from "../stripe-app.schema.json";
import baseSchema from "../stripe-app-base.schema.json";
import localSchema from "../stripe-app-local.schema.json";

const ajv = new Ajv2019({ schemas: [baseSchema] });
addFormats(ajv);

// markdownDescription is not part of the JSON Schema standard, it's specific to VSCode
ajv.addKeyword("markdownDescription");

const basicManifest = Object.freeze({
  id: "com.example.app",
  version: "0.0.1",
  name: "Test App",
  icon: "./icon.png",
  permissions: [
    {
      permission: "customer_read",
      purpose: "Cool purpose",
    },
  ],
  app_backend: {
    webhooks: [
      {
        url: "https://example.com",
        enabled_events: ["customer.created"],
        api_version: "1.0.0",
      },
    ],
  },
  ui_extension: {
    views: [
      {
        viewport: "stripe.dashboard.customer.detail",
        component: "View",
      },
    ],
    actions: [],
    content_security_policy: {
      "connect-src": ["https://example.com/path"],
      purpose: "Test",
    },
  },
  post_install_action: {
    type: "settings",
  },
  constants: {
    HELLO: "world",
  },
});

describe("Validate manifests", () => {
  describe("Main manifest schema", () => {
    const validate = ajv.compile(schema);

    it("validates a basic manifest", () => {
      expect(validate).toBeDefined();
      const valid = validate(basicManifest);
      expect(valid).toBe(true);
    });

    it("rejects an empty manifest", () => {
      const valid = validate({});
      expect(valid).toBe(false);
    });

    it("accepts underscores in app id", () => {
      const valid = validate({
        ...basicManifest,
        id: "app_id.stripe.com",
      });
      expect(valid).toBe(true);
    });

    it("rejects invalid permissions", () => {
      const valid = validate({
        ...basicManifest,
        permissions: [
          {
            permission: "fake_permission",
            purpose: "Cool purpose",
          },
        ],
      });
      expect(valid).toBe(false);
    });

    it("rejects invalid viewports", () => {
      const valid = validate({
        ...basicManifest,
        ui_extension: {
          ...basicManifest.ui_extension,
          views: [
            {
              viewport: "fake.viewport",
              component: "View",
            },
          ],
        },
      });
      expect(valid).toBe(false);
    });

    it("rejects CSP connect-src without a path", () => {
      const valid = validate({
        ...basicManifest,
        ui_extension: {
          ...basicManifest.ui_extension,
          content_security_policy: {
            "connect-src": ["https://no-path.com/"],
            purpose: "Test",
          },
        },
      });
      expect(valid).toBe(false);
    });

    it("rejects CSP connect-src without a purpose", () => {
      const valid = validate({
        ...basicManifest,
        ui_extension: {
          ...basicManifest.ui_extension,
          content_security_policy: {
            "connect-src": ["https://no-path.com/"],
          },
        },
      });
      expect(valid).toBe(false);
    });

    it("accepts post-install action url property for external", () => {
      const valid = validate({
        ...basicManifest,
        post_install_action: {
          type: "external",
          url: "https://example.com",
        },
      });
      expect(valid).toBe(true);
    });

    it("rejects post-install action url property for settings", () => {
      const valid = validate({
        ...basicManifest,
        post_install_action: {
          type: "settings",
          url: "https://example.com",
        },
      });
      expect(valid).toBe(false);
    });

    it('rejects additional properties, e.g. "extends"', () => {
      const valid = validate({
        ...basicManifest,
        extends: "stripe-app.dev.json",
      });
      expect(valid).toBe(false);
    });
  });

  describe("Local manifest schema", () => {
    const validate = ajv.compile(localSchema);

    it('rejects an empty manifest without an "extends" field', () => {
      const valid = validate({});
      expect(valid).toBe(false);
    });

    it.each([
      "stripe-app.json",
      "stripe-app.dev.json",
      "stripe-app.prod.json",
      "./stripe-app.json",
      "../stripe-app.json",
      "../schemas/stripe-app.json",
      "../../stripe-app.json",
      "../../../../foo/bar/stripe-app.json",
      "../../stripe-app.json",
    ])('accepts "extends" value: %s', (value) => {
      const valid = validate({
        extends: value,
      });
      expect(valid).toBe(true);
    });

    it("accepts an overridden CSP connect-src", () => {
      const valid = validate({
        extends: "stripe-app.json",
        ui_extension: {
          content_security_policy: {
            "connect-src": ["https://fake-data.acme.com/api/"],
          },
        },
      });
      expect(validate.errors).toBe(null);
    });
  });
});
