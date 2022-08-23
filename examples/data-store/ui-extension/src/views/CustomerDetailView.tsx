import { Box, ContextView } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import DataStoreListComponent from '../components/DataStoreListComponent';

const CustomerDetailView = ({ userContext, environment }: ExtensionContextValue) => {
  return (
    <ContextView title="Data Store Entities">
      <Box css={{margin: "medium"}}>
        This example app shows Data Store entities attached to the Customer
      </Box>
      <DataStoreListComponent
        resourceType={environment!.objectContext.object}
        resourceId={environment!.objectContext.id}/>
    </ContextView>
  );
};

export default CustomerDetailView;
