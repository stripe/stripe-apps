import 'dotenv/config';

export const apiUrl = process.env.API_URL;
export const authUrl = 'https://accounts.google.com/o/oauth2/auth';
export const authTokenUrl = 'https://oauth2.googleapis.com/token';
export const authRedirectUrl = `${apiUrl}/api/auth/callback/logged-in`;
export const authSuccessRedirectURL = process.env.AUTH_SUCCESS_REDIRECT_URL;
export const authLogoutUrl = 'https://accounts.google.com/o/oauth2/revoke';
export const authClientId = process.env.AUTH_CLIENT_ID;
export const authClientSecret = process.env.AUTH_CLIENT_SECRET;
export const authUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
export const port = process.env.PORT || 3000;
export const scope =
  'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile';
export const stripeAPIKey = process.env.STRIPE_API_KEY;
export const stripeAppSecret = process.env.STRIPE_APP_SECRET;
