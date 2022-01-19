import {
    SettingsView,
    Box,
    TextField,
    Select,
} from '@stripe/ui-extension-sdk/ui';
import { useState } from 'react';
import { DummyDB } from '../libs/dummyDB';
  
const dbClient = new DummyDB();
const options = [{
    label: 'Choose your country',
    value: ''
}, {
    label: 'United States',
    value: 'us'
}, {
    label: 'Japan',
    value: 'jp'
}];
const Settings = () => {
    const [username, setUsername] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    return (
        <SettingsView
            header="Custom app settings"
            subheader="App settings subheader"
            onSave={async() => {
                await dbClient.saveOptions({
                    username,
                    country,
                })
                    .then(() => {
                        setStatus('completed');
                    })
                    .catch(e => {
                        setStatus(e.message);
                    });
            }}
            statusMessage={status}
        >
            <Box
                css={{
                    layout:'column',
                    gap: 'large',
                    padding: 'large',
                    backgroundColor: 'container',
                    fontFamily: 'monospace',
                    borderRadius: 'small',
        
                }}
            >
                <Box>
                    <TextField
                        type="text"
                        label="Username"
                        placeholder="Username"
                        onChange={e=>{
                            setUsername(e.target.value)
                        }}
                    />
                </Box>
                <Box>
                    <Select
                        name="country"
                        label="Country"
                        onChange={(e) => {
                          const target = options[e.target.selectedIndex];
                          setCountry(target.value);
                        }}
                    >
                        {options.map(option => {
                            return (
                                <option value={option.value} key={option.value}>
                                    {option.label}
                                </option>
                            );
                        })}
                    </Select>
                </Box>
            </Box>
        </SettingsView>
    );
};

export default Settings;
