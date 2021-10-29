import {useState, useCallback, useEffect} from 'react';
import {
    FormLayout,
    FormBlock,
    FormRow,
    FormField,
    Group,
    SettingsView,
    Select,
    SelectOption,
    Spinner
} from '@stripe/tailor-browser-sdk/ui';
import stripeClient from '../clients/stripe';
import Stripe from 'stripe';

type FormStatus = 'initial' | 'saving' | 'saved' | 'error';

const AppSettings = ({ account }) => {
    const [status, setStatus] = useState<FormStatus>('initial');
    const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);

    const getCustomers = useCallback(async () => {
        const response = await stripeClient.customers.list();
        const customers = response.data;
        setCustomers(customers);
    }, [])

    useEffect(() => { 
        getCustomers();
    }, []);

    const saveSettings = useCallback(async (values) => {
        const { favorite_color, customer } = values;
        if (customer && favorite_color) {
            setStatus('saving');
            try {
                await stripeClient.customers.update(customer, {
                    metadata: { favorite_color },
                });
                setStatus('saved');
            } catch (error) {
                setStatus('error');
                console.error('error saving account: ', error);
            }
        }
    }, [account]);

    const getStatusLabel = useCallback( () => {
        switch(status) {
            case 'saving':
                return 'Saving...';
            case 'saved':
                return 'Saved!';
            case 'error':
                return 'Error: There was an error saving your settings.';
            case 'initial':
            default:
                return '';
        }
    }, [status]) 
    const statusLabel = getStatusLabel();

    return (
        <SettingsView 
            header="Favorite colors" 
            subheader="Record your customer's favorite colors so you never forget!"
            statusMessage={statusLabel}
            onSave={saveSettings}
        >
            <FormLayout>
                { customers.length ? (
                    <FormBlock>
                        <FormRow name="customer" label="Customer">
                            <FormField>
                                <Select 
                                    name="customer" 
                                    label="Customer" 
                                    description="Select a customer"
                                >
                                    { customers.map(customer => 
                                        <SelectOption 
                                            key={customer.id}
                                            label={customer.name} 
                                            value={customer.id} 
                                        />
                                    ) }
                                </Select>
                            </FormField>
                        </FormRow>
                        <FormRow name="favorite_color" label="Favorite Color">
                            <FormField
                                label="Favorite Color"
                                description="What is their favorite color?"
                            >
                                <Select 
                                    name="favorite_color" 
                                    id="favorite_color"
                                    label="Favorite Color" 
                                >
                                    <SelectOption label="Select a color" value="" />
                                    <SelectOption label="Red" value="red" />
                                    <SelectOption label="Blue" value="blue" />
                                    <SelectOption label="Green" value="green" />
                                    <SelectOption label="Yellow" value="yellow" />
                                    <SelectOption label="Purple" value="purple" />
                                    <SelectOption label="Orange" value="orange" />
                                    <SelectOption label="Pink" value="pink" />
                                    <SelectOption label="Black" value="black" />
                                    <SelectOption label="White" value="white" />
                                    <SelectOption label="Brown" value="brown" />
                                    <SelectOption label="Gray" value="gray" />
                                </Select>
                            </FormField>
                        </FormRow>
                    </FormBlock>
                ) : 
                    <Group 
                        padding={24} 
                        alignItems="center" 
                        justifyContent="center"
                    >
                        <Spinner />
                    </Group>
                }
            </FormLayout>
        </SettingsView>
    );
}
export default AppSettings;
