import React, { ChangeEvent, useState } from 'react';

import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  Select,
} from '@stripe/ui-extension-sdk/ui';

import { baseURL } from '../config';
import { exportCategories } from '../constants/exportOptions';
import useFetchWithCredentials from '../hooks/useFetchWithCredentials';
import { Action, ExportCategory, UserContext } from '../types';

const SHEETS_URI = `${baseURL}/api/sheets`;

// sort categories alphabetically
const categories = exportCategories.sort((a, b) =>
  a.label < b.label ? -1 : 0,
);

interface Props {
  userContext: UserContext | undefined;
  dispatch: (action: Action) => void;
}

interface UrlListTypes {
  url: string;
  category: string;
}

export default function Export({ userContext, dispatch }: Props) {
  const [category, setCategory] = useState<string>('');
  const fetchWithCredentials = useFetchWithCredentials(userContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [urlList, setUrlList] = useState<UrlListTypes[]>([]);

  const handleExport = () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    fetchWithCredentials(SHEETS_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    })
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(response => {
        setIsLoading(false);
        setError(null);
        setSuccessMessage(
          `${category} exported successfully. ${response.message}.`,
        );
        setUrlList([...urlList, { url: response.url, category }]);
      })
      .catch(error => {
        if (error.text) {
          error.text().then((errorMessage: string) => {
            setError(`Unable to export ${category}. ${errorMessage}`);
            setIsLoading(false);
          });
        } else {
          dispatch({
            type: 'log-out-with-error',
            payload: { error: 'A server error occurred. Please try again.' },
          });
        }
      });
  };

  return (
    <>
      <Box slot="actions">
        <Button
          type="destructive"
          onPress={() => dispatch({ type: 'log-out' })}
        >
          Log Out
        </Button>
      </Box>
      <Box>
        <Select
          name="data-select"
          label="Choose data to export"
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setCategory(e.target.value);
          }}
        >
          <option value="">Choose an option</option>
          {categories.map((category: ExportCategory) => (
            <option key={category.key} value={category.label}>
              {category.label}
            </option>
          ))}
        </Select>
        <Box css={{ marginTop: 'large', marginBottom: 'large' }}>
          <Button
            type="primary"
            disabled={!category || isLoading}
            onPress={handleExport}
          >
            Export {category}
          </Button>
        </Box>
        {isLoading && <Box>Exporting {category}...</Box>}
        {error && <Box css={{ color: 'critical' }}>{error}</Box>}
        {successMessage && (
          <Box css={{ color: 'success' }}>{successMessage}</Box>
        )}
        {urlList.length > 0 && (
          <List aria-label="Exported data list">
            {urlList.map((item, index) => (
              <ListItem
                key={index}
                title={item.category}
                secondaryTitle={
                  <Box slot="description">
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open spreadsheet
                    </Link>
                  </Box>
                }
              />
            ))}
          </List>
        )}
      </Box>
    </>
  );
}
