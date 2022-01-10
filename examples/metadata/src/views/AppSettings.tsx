import {useState, useCallback, useEffect} from 'react';
import {
    Box,
    SettingsView,
    Select,
} from '@stripe/ui-extension-sdk/ui';
import stripeClient from '../clients/stripe';
import Stripe from 'stripe';
import type {TailorExtensionContextValue} from '@stripe/ui-extension-sdk/context';

type FormStatus = 'initial' | 'saving' | 'saved' | 'error';

const AppSettings = ({ userContext }: TailorExtensionContextValue) => {
    const [status, setStatus] = useState<FormStatus>('initial');
    const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);

    const getCustomers = useCallback(async () => {
        const response = await stripeClient.customers.list();
        const customers = response.data;
        console.log('customers: ', customers)
        setCustomers(customers);
    }, [])

    useEffect(() => { 
        getCustomers();
    }, []);

    const saveSettings = async (values: any) => {
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
    };

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
           <Box css={{
                padding:'medium',
                backgroundColor: 'container',
            }}>
                { customers.length ? (
                    <Box key={1}>
                        <Box css={{marginBottom: 'medium'}}>
                            <Box 
                                css={{
                                    marginBottom: 'small',
                                    font: 'lead'
                                }}
                            >
                                Select a customer
                            </Box>
                            <Select 
                                name="customer" 
                                label="&nbsp;Customer" 
                            >   
                                <option 
                                    key={0}
                                    value="" 
                                >
                                    Select a Customer
                                </option>
                                { customers.map(customer => 
                                    <option 
                                        key={customer.id}
                                        value={customer.id} 
                                    >
                                        {customer.name || ''} 
                                    </option>
                                ) }
                            </Select>
                        </Box>
                        <Box css={{marginBottom: 'medium'}}>
                            <Box 
                                css={{
                                    marginBottom: 'small',
                                    font: 'lead'
                                }}
                            >
                                What is their favorite color?
                                <Select 
                                    name="favorite_color" 
                                    id="favorite_color"
                                    label="&nbsp;Favorite Color" 
                                >
                                    <option value="">Select a color</option>
                                    <option value="critical">Red</option>
                                    <option value="info">Blue</option>
                                    <option value="success">Green</option>
                                    <option value="brand">Purple</option>
                                    <option value="attention">Orange</option>
                                    <option value="primary">Black</option>
                                    <option value="disabled">Grey</option>
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                ) :  <Box>Loading...</Box> }
            </Box>
        </SettingsView>
    );
}
export default AppSettings;
