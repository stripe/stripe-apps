
import { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { Box } from "@stripe/ui-extension-sdk/ui";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { DataStore } from "./client";
type DataStoreProps = {
    client: DataStore;
}
export type DataStoreProviderProps = {
    userContext: ExtensionContextValue['userContext'];
    children: React.ReactNode;
}
const DataStoreContext = createContext<DataStoreProps>({
    client: null
} as any);
export const useDataStore = () => useContext(DataStoreContext);
export const DataStoreProvider: FC<DataStoreProviderProps> = ({userContext, children}) => {
    const userId = userContext?.id;
    const [client, setClient] = useState<DataStore | null>();
    useEffect(() => {
        if (!userId) return;
        setClient(new DataStore(userId))
    }, [userId, setClient])
    if (!userId || !client) {
        return <Box>loading...</Box>
    }
    return (
        <DataStoreContext.Provider value={{
            client,
        }}>
            {children}
        </DataStoreContext.Provider>
    )
}