import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../stripe-app.schema.json";

const ajv = new Ajv();
addFormats(ajv);

// markdownDescription is not part of the JSON Schema standard, it's specific to VSCode
ajv.addKeyword("markdownDescription");

const validate = ajv.compile(schema);

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
});

describe("Validate manifests", () => {
  it("validates a basic manifest", () => {
    const valid = validate(basicManifest);
    expect(valid).toBe(true);
  });

  it("rejects an empty manifest", () => {
    const valid = validate({});
    expect(valid).toBe(false);
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
});
