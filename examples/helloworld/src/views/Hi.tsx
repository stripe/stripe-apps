import {
  AlignBox,
  ContextView,
  Group,
  Icon,
  Body,
  BodyMono,
  Heading,
} from '@stripe/tailor-browser-sdk/ui';
import type {TailorExtensionContextValue} from '@stripe/tailor-browser-sdk/context';

const Hi = ({object, user, account}: TailorExtensionContextValue) => (
  <ContextView
    title="🧩 This is Hi!"
    description="Make a change to Hi.tsx and reload to see your change here."
  >
    <Group direction="vertical" spacing={20}>
      <AlignBox flex={{direction: 'row'}}>
        <Icon icon="review" size={16} />
        <Group padding={{left: 12}} spacing={4}>
          <Heading>Views</Heading>
          <Body>
            Using the Stripe Sail component library, you can build any UI you
            want in the Stripe Dashboard. Or take advantage of pre-built,
            specialized views to display lists, graphs, etc.
          </Body>
        </Group>
      </AlignBox>
      <AlignBox flex={{direction: 'row'}}>
        <Icon icon="change" size={16} />
        <Group padding={{left: 12}} spacing={4}>
          <Heading>Actions</Heading>
          <Body>These aren't implemented yet. </Body>
        </Group>
      </AlignBox>
      <AlignBox flex={{direction: 'row'}}>
        <Icon icon="api" size={16} />
        <Group padding={{left: 12}} spacing={4}>
          <Heading>Stripe CLI</Heading>
          <Body>
            The CLI offers a variety of helpful commands for working with
            Dashboard UI Tailor apps. Run{' '}
            <BodyMono>stripe help tailor</BodyMono> to see all the options.
          </Body>
        </Group>
      </AlignBox>
    </Group>
  </ContextView>
);

export default Hi;
