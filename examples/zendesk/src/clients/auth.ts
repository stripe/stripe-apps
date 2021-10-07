export interface TokenResponse {
  accessToken: string;
  errorMessage?: string;
}

export default class AuthClient {
  private readonly baseUri = "https://tailor-zendesk-srv.herokuapp.com";

  constructor(
    private readonly stripeAccountId: string,
    private readonly zendeskSubdomain: string
  ) {}

  getRedirectUri() {
    return `${this.baseUri}/authorize`;
  }

  async getToken(): Promise<TokenResponse> {
    try {
      const response = await fetch(
        `${this.baseUri}/token?zendeskSubdomain=${this.zendeskSubdomain}&stripeAccountId=${this.stripeAccountId}`,
        {
          method: "GET",
          headers: {
            "x-very-secret-header":
              "This-is-a-shared-secret-for-tailor-backend-auth",
          },
        }
      );

      if (!response.ok) {
        return {
          accessToken: "",
          errorMessage: response.statusText,
        };
      }

      const { access_token: accessToken } = await response.json();
      if (accessToken) {
        return { accessToken };
      }

      return {
        accessToken: "",
        errorMessage: "Missing token.",
      };
    } catch (e) {
      return Promise.resolve({
        accessToken: "",
        errorMessage: "Unknown error occurred.",
      });
    }
  }
}
