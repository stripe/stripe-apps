import {
  Box,
  Button,
  Img,
} from '@stripe/ui-extension-sdk/ui';
const ClimateLogo = require('./climate_logo.svg')

type Props = {
  appId: string;
};

const ClimateLinkComponent = ({appId}: Props) => {
  return (
    <Box
      css={{
        keyline: 'neutral',
        borderRadius: 'medium',
        paddingX: 'large',
        paddingY: 'medium',
      }}
    >
      <Box
        css={{
          layout: 'row',
          gap: 'small',
          alignY: 'center',
          marginBottom: 'medium',
          font: 'subheading',
        }}
      >
        <Img
          src={ClimateLogo}
          alt="Stripe Climate logo"
          height="20"
          width="20"
        />
        CLIMATE
      </Box>
      <Box css={{marginBottom: 'small', font: 'heading'}}>
        Remove carbon with every payment
      </Box>
      <Box css={{marginBottom: 'medium', font: 'body'}}>
        With Stripe Climate, you can direct a fraction of your revenue to fund
        frontier carbon removal.
      </Box>
      <Button
        href={`https://dashboard.stripe.com/get-started/climate?src_app=${appId}`}
      >
        Learn more
      </Button>
    </Box>
  );
};

export default ClimateLinkComponent;