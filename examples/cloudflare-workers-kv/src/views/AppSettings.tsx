import { useCallback, useEffect, useState } from 'react';
import {
    FormLayout,
    FormBlock,
    FormRow,
    FormField,
    TextInput,
    SettingsView
} from '@stripe/tailor-browser-sdk/ui';

const AppSettings = () => {
    const [storedValue, setStoredValue] = useState(null)
    const [hasSaved, setHasSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(false)

    const greetingKey = 101 // this can be a userID that is populated from props or useTailorContext

    useEffect(() => {
        const fetchSavedGreeting = async (key) => {
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
    }, [greetingKey])

    const saveSettings = useCallback(async (values) => {
        setIsSaving(true)
        const { greeting } = values
        if (greeting) {
            try {
                const result = await fetch(
                    'https://restless-bread.ng-stripe.workers.dev/greeting/',
                    {
                        method: 'POST',
                        body: JSON.stringify({ key: greetingKey, greeting })
                    }
                );
                await result.text()
                setHasSaved(true)
            } catch (err) {
                setError(err.message);
            }
        }
        setIsSaving(false)
    }, []);

    const determineStatusLabel = () => {
        if (isSaving) {
            return 'Saving...'
        }
        if (hasSaved) {
            return 'Saved!'
        }
        if (error) {
            return `Error saving data: ${error}`
        }
        return ''
    }

    const statusLabel = determineStatusLabel()

    return (
        <SettingsView onSave={saveSettings} statusMessage={statusLabel} header="Set a Greeting" >
            <FormLayout title="Set a greeting">
                <FormBlock>
                    <FormRow name="greeting" label="A greeting to display">
                        <FormField
                            label="Greeting"
                            description="Please enter a greeting"
                        >
                            <TextInput
                                name="greeting"
                                id="greeting"
                                placeholder={ storedValue || "hello" }
                            />
                        </FormField>
                    </FormRow>
                </FormBlock>
            </FormLayout>
        </SettingsView>
    )
}

export default AppSettings
