import { format } from 'date-fns';
import { google } from 'googleapis';

import { authClientId, authClientSecret, authRedirectUrl } from '../config';
import { fetchStripeData } from '../utils/fetchStripeData';

const oauth2Client = new google.auth.OAuth2(
  authClientId,
  authClientSecret,
  authRedirectUrl,
);

export const sheets = async ({ req, res, tokenStore }) => {
  const { category } = req.body;
  const accessToken = tokenStore.get(res.locals.sessionId);

  if (!category) {
    return res.sendStatus(400);
  }

  oauth2Client.setCredentials(accessToken);

  const googleSheets = google.sheets({
    version: 'v4',
    auth: oauth2Client,
  });

  let spreadsheetId = null;

  try {
    const stripeData = await fetchStripeData(category);

    if (stripeData === null || stripeData.data.length === 0) {
      throw 'No data found for the specified category';
    }

    const spreadsheet = await googleSheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `Stripe Export: ${category} ${format(
            new Date(),
            'yyyy-mm-dd H:mm',
          )}`,
        },
      },
    });

    spreadsheetId = spreadsheet.data.spreadsheetId;

    const sheet = await googleSheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      valueInputOption: 'USER_ENTERED',
      range: 'Sheet1',
      requestBody: {
        values: [stripeData.fields, ...stripeData.data],
      },
    });

    await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.9,
                    green: 0.9,
                    blue: 0.9,
                  },
                  textFormat: {
                    bold: true,
                    fontSize: 11,
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                dimension: 'COLUMNS',
                startIndex: 0,
              },
            },
          },
        ],
      },
    });

    res.status(200).send({
      message: `${sheet.data.updatedCells} cells updated`,
      url: spreadsheet.data.spreadsheetUrl,
    });
  } catch (error) {
    res.sendStatus(400);
  }
};
