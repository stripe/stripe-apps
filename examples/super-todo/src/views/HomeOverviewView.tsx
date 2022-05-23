import {
  Box,
  Link,
  Icon,
  Inline
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {SuperTodoView} from "../components";

const HomeOverviewView = ({userContext}: ExtensionContextValue) => {
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
      <Box css={{marginTop: 'small'}}>
        The Supertodo App for Stripe let’s you create todo lists for your team right in the Stripe Dashboard.
      </Box>
      <Box css={{marginTop: 'small'}}>
        To start creating tasks, head to one of the following pages to see your lists.
      </Box>

      <Box css={{
        marginTop: 'xlarge',
        padding: 'medium',
        background: 'container',
        borderRadius: 'medium',
      }}>
        <Box css={{stack: 'x', distribute: 'space-between', alignY: 'center', width: 'fill'}}>
          <Link  href="customers"><Inline>Customers</Inline></Link>
          <Box css={{ color: "info"}}>
            <Icon name="next" />
          </Box>
        </Box>
      </Box>

      <Box css={{
        marginTop: 'medium',
        padding: 'medium',
        background: 'container',
        borderRadius: 'medium',
      }}>
        <Box css={{stack: 'x', distribute: 'space-between', alignY: 'center', width: 'fill'}}>
          <Link  href="payments"><Inline>Payments</Inline></Link>
          <Box css={{ color: "info"}}>
            <Icon name="next" />
          </Box>
        </Box>
      </Box>
    </SuperTodoView>
  );
};

export default HomeOverviewView;
