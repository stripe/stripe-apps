import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../stripe-app.schema.json";
import schemaLocal from "../stripe-app-local.schema.json";

const ajv = new Ajv();
addFormats(ajv);

// markdownDescription is not part of the JSON Schema standard, it's specific to VSCode
ajv.addKeyword("markdownDescription");

const validate = ajv.compile(schema);
const validateLocal = ajv.compile(schemaLocal);

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
  allowed_redirect_uris: [
    "https://myapp.com/cb",
    "https://localhost:3000/callback",
  ],
  sandbox_install_compatible: true,
});

describe("Validate manifests", () => {
  it("validates a basic manifest", () => {
    const valid = validate(basicManifest);
    expect(valid).toBe(true);
  });

  it("validates a basic local manifest", () => {
    const valid = validateLocal({
      extends: "stripe-app.json",
      ...basicManifest,
    });
    expect(valid).toBe(true);
  });

  it("rejects an empty manifest", () => {
    const valid = validate({});
    expect(valid).toBe(false);
  });

  it("accepts an empty local manifest", () => {
    const valid = validateLocal({});
    expect(valid).toBe(true);
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
          "connect-src":
            basicManifest.ui_extension.content_security_policy["connect-src"],
        },
      },
    });
    expect(valid).toBe(false);
  });

  it("accepts a local CSP connect-src without a purpose", () => {
    const valid = validateLocal({
      ui_extension: {
        content_security_policy: {
          "connect-src":
            basicManifest.ui_extension.content_security_policy["connect-src"],
        },
      },
    });
    expect(valid).toBe(true);
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

  it("rejects invalid url property for allowed_redirect_uris", () => {
    const valid = validate({
      ...basicManifest,
      allowed_redirect_uris: ["invalid"]
    });
    expect(valid).toBe(false);
  });

  it("rejects invalid value for sandbox_install_compatible", () => {
    const valid = validate({
      ...basicManifest,
      sandbox_install_compatible: { enabled: true },
    });
    expect(valid).toBe(false);
  })
});
