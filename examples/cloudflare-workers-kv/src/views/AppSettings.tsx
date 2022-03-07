import { useCallback, useEffect, useState } from 'react';
import {
    Box,
    TextField,
    SettingsView
} from '@stripe/ui-extension-sdk/ui';

const AppSettings = () => {
    const [storedValue, setStoredValue] = useState<string>('');
    const [hasSaved, setHasSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(false);

    const greetingKey = 101; // this can be a userID that is populated from props or useTailorContext

    useEffect(() => {
        const fetchSavedGreeting = async (key: number) => {
            try {
                const response = await fetch(`https://restless-bread.ng-stripe.workers.dev/greeting/${key}`)
                const savedGreeting = await response.text()
                if (savedGreeting) {
                    setStoredValue(savedGreeting)
                }
            } catch (error) {
                console.log('Error: ', error)
            }
        };
        fetchSavedGreeting(greetingKey);
    }, [greetingKey]);

    const saveSettings = useCallback(async (values) => {
        setIsSaving(true);
        const { greeting } = values;
        if (greeting) {
            try {
                const result = await fetch(
                    'https://restless-bread.ng-stripe.workers.dev/greeting/',
                    {
                        method: 'POST',
                        body: JSON.stringify({ key: greetingKey, greeting })
                    }
                );
                await result.text();
                setStoredValue(greeting);
                setHasSaved(true);
            } catch (err: any) {
                setError(err.message);
            }
        }
        setIsSaving(false);
    }, []);

    const determineStatusLabel = () => {
        if (isSaving) {
            return 'Saving...';
        }
        if (hasSaved) {
            return 'Saved!';
        }
        if (error) {
            return `Error saving data: ${error}`;
        }
        return '';
    };

    const statusLabel = determineStatusLabel();

    return (
        <SettingsView onSave={saveSettings} statusMessage={statusLabel}>
            <Box css={{
                padding:'medium',
                backgroundColor: 'container',
            }}>
                <Box
                    css={{
                        font: 'lead'
                    }}
                >
                    Please enter a greeting
                </Box>
                <Box
                    css={{
                        marginBottom: 'medium',
                        font: 'caption'
                    }}
                >
                    Saved Greeting: {storedValue || 'None'}
                </Box>
                <TextField
                    // @ts-ignore
                    name="greeting"
                    type="text"
                    label="Greeting:"
                    size="medium"
                />
            </Box>
        </SettingsView>
    );
}

export default AppSettings;
