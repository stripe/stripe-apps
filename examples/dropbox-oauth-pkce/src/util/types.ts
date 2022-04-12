export interface TokenData {
  access_token: string;
  account_id: string;
  expires_in: number;
  scope: string;
  token_type: string;
  uid: string;
}

export interface AccountData {
  email: string;
  name: {
    display_name: string;
  };
}
