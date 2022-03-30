import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {
    SettingsView,
    Box,
    TextField,
    Select,
} from '@stripe/ui-extension-sdk/ui';
import { useState, useEffect } from 'react';
import { SecretStore } from '../libs/SecretStore';
  
const dbClient = new SecretStore();
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
const Settings = ({userContext}: ExtensionContextValue) => {
    const [username, setUsername] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    useEffect(() => {
      if (!userContext) return;
      dbClient.getOptions(userContext.id)
        .then(data => {
          setUsername(data.username || '');
          setCountry(data.country || '');
        });
    }, [userContext]);
    return (
        <SettingsView
            onSave={async() => {
                if (!userContext) return;
                await dbClient.saveOptions(userContext.id, {
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
                        value={username}
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
                        value={country}
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
