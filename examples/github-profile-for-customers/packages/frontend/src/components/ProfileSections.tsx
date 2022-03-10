import { Box } from '@stripe/ui-extension-sdk/ui';

interface SingleSectionProps {
  item?: string;
  label: string;
}

interface ListSectionProps {
  items: { name: string }[];
  label: string;
}

export const SingleSection = ({ item, label }: SingleSectionProps) => {
  if (item) {
    return (
      <Box>
        <Box css={{ fontWeight: 'semibold' }}>{`${label}:`}</Box>
        <Box>{item}</Box>
      </Box>
    );
  }
  return null;
};

export const ListSection = ({ items, label }: ListSectionProps) => {
  if (items.length > 0) {
    return (
      <Box>
        <Box css={{ fontWeight: 'semibold' }}>{`${label}:`}</Box>
        {items.map(node => (
          <Box key={node.name}>{node.name}</Box>
        ))}
      </Box>
    );
  }
  return null;
};
