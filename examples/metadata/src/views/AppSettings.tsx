import {useState, useCallback, useEffect} from 'react';
import {
    View,
    SettingsView,
    Select
} from '@stripe/tailor-browser-sdk/ui';
import stripeClient from '../clients/stripe';
import Stripe from 'stripe';
import type {TailorExtensionContextValue} from '@stripe/tailor-browser-sdk/context';

type FormStatus = 'initial' | 'saving' | 'saved' | 'error';

const AppSettings = ({ userContext }: TailorExtensionContextValue) => {
    const [status, setStatus] = useState<FormStatus>('initial');
    const [customers, setCustomers] = useState<Array<Stripe.Customer>>([]);

    const getCustomers = useCallback(async () => {
        const response = await stripeClient.customers.list();
        const customers = response.data;
        console.log('customers: ', customers);
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
           <View css={{
                padding:'medium',
                backgroundColor: 'container',
            }}>
                { customers.length ? (
                    <View>
                        <View css={{marginBottom: 'medium'}}>
                            <View 
                                css={{
                                    marginBottom: 'small',
                                    font: 'lead'
                                }}
                            >
                                Select a customer
                            </View>
                            <Select 
                                name="customer" 
                                label="&nbsp;Customer" 
                            >
                                { customers.map(customer => 
                                    <option 
                                        key={customer.id}
                                        label={customer.name || ''} 
                                        value={customer.id} 
                                    />
                                ) }
                            </Select>
                        </View>
                       
                        <View css={{marginBottom: 'medium'}}>
                            <View 
                                css={{
                                    marginBottom: 'small',
                                    font: 'lead'
                                }}
                            >
                                What is their favorite color?
                            </View>
                            <Select 
                                name="favorite_color" 
                                id="favorite_color"
                                label="&nbsp;Favorite Color" 
                            >
                                <option label="Select a color" value="" />
                                <option label="Red" value="red" />
                                <option label="Blue" value="blue" />
                                <option label="Green" value="green" />
                                <option label="Yellow" value="yellow" />
                                <option label="Purple" value="purple" />
                                <option label="Orange" value="orange" />
                                <option label="Pink" value="pink" />
                                <option label="Black" value="black" />
                                <option label="White" value="white" />
                                <option label="Brown" value="brown" />
                                <option label="Gray" value="gray" />
                            </Select>
                        </View>
                        
                    </View>
                ) : 
                    <View>Loading...</View>
                }
            </View>
        </SettingsView>
    );
}
export default AppSettings;
