import { TokenData, AccountData } from "./types";

export const getDropboxAccount = async (
  tokenData: TokenData,
): Promise<AccountData | void> => {
  try {
    const response = await fetch(
      'https://api.dropboxapi.com/2/users/get_account',
      {
        method: 'POST',
        body: JSON.stringify({ account_id: tokenData.account_id }),
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(await response.text());
  } catch (e) {
    console.error('Unable to get account data:', (e as Error).message);
  }
};