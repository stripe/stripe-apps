import { Tickets } from "@types/node-zendesk";

export default class ZendeskClient {
  private accessToken = "";
  private readonly baseUri = `https://${this.subdomain}.zendesk.com`;
  private readonly apiUri = `${this.baseUri}/api/v2`;

  constructor(
    private readonly subdomain: string,
    private readonly clientId: string,
    private readonly stripeAccountId: string
  ) {}

  private makeRequest(path: string, method: string) {
    if (!this.hasAccessToken()) {
      throw new Error("Access token has not been set");
    }

    return fetch(`${this.apiUri}/${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  hasAccessToken(): boolean {
    return !!this.accessToken;
  }

  getAuthUrl(redirectUri: string, objectType: string, objectId: string) {
    const state = `${this.subdomain}/${this.stripeAccountId}/${objectType}/${objectId}`;
    const params = {
      response_type: "code",
      redirect_uri: redirectUri,
      client_id: this.clientId,
      scope: "read write",
      state,
    };
    const urlParams = Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join("&");

    return `${this.baseUri}/oauth/authorizations/new?${urlParams}`;
  }

  getTickets(): Promise<Tickets.ListPayload> {
    return this.makeRequest("tickets.json", "GET").then((resp) => resp.json());
  }

  getTicketsByEmail(email: string): Promise<Tickets.ListPayload> {
    const searchQuery = `type:ticket requester:${email}`;

    return this.makeRequest(
      `search.json?query=${encodeURIComponent(searchQuery)}`,
      "GET"
    )
      .then((resp) => resp.json())
      .then((data) => {
        // Renaming results to tickets to conform with Tickets.ListPayload type
        data.tickets = data.results;
        delete data.results;
        return data;
      });
  }
}
