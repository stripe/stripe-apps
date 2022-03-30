import { Box } from '@stripe/ui-extension-sdk/ui';
import { FC } from 'react';

export const Layout: FC<{
  description?: string;
}> = ({ children, description }) => (
  <Box
    css={{
      paddingX: 'large',
      marginY: 'medium',
      backgroundColor: 'container',
      fontFamily: 'monospace',
      borderRadius: 'small',
    }}
  >
    <Box css={{ paddingY: 'medium' }} />
    {description ? <Box css={{ marginBottom: 'medium' }}>{description}</Box> : null}
    {children}
    <Box css={{ paddingY: 'small' }} />
  </Box>
);
