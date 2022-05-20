import {
  Box,
  Link,
  Icon,
  Inline
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {SuperTodoView} from "../components";

const HomeOverviewView = ({userContext, environment}: ExtensionContextValue) => {
  return (
    <SuperTodoView
      title="Get started"
      externalLink={{
        label: "Go to SuperTodo dashboard",
        href: "#",
      }}>
      <Box css={{font: 'heading'}}>
        Welcome {userContext.account.name}
      </Box>
      <Box css={{lineHeight: 1.5, marginTop: 'small'}}>
        The Supertodo App for Stripe let’s you create todo lists for your team right in the Stripe Dashboard.
      </Box>
      <Box css={{lineHeight: 1.5, marginTop: 'small'}}>
        To start creating tasks, head to one of the following pages to see your lists.
      </Box>

      <Box css={{
        marginTop: 'xlarge',
        padding: 'medium',
        background: 'container',
        borderRadius: 'medium',
      }}>
        <Link css={{stack: 'x', distribute: 'space-between', alignY: 'center', width: 'fill'}} href="customers"><Inline>Customers</Inline><Icon name="next" /></Link>
      </Box>

      <Box css={{
        marginTop: 'medium',
        padding: 'medium',
        background: 'container',
        borderRadius: 'medium',
      }}>
        <Link css={{stack: 'x', distribute: 'space-between', alignY: 'center', width: 'fill'}} href="payments"><Inline>Payments</Inline><Icon name="next" /></Link>
      </Box>
    </SuperTodoView>
  );
};

export default HomeOverviewView;
