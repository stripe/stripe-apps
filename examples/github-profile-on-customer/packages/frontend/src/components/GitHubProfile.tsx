import { Box } from '@stripe/ui-extension-sdk/ui';

import { GithubData } from '../types/GitHub';
import { ListSection, SingleSection } from './ProfileSections';

export const GitHubProfile = ({ user }: GithubData) => {
  return (
    <Box css={{ layout: 'column', gap: 'medium' }}>
      {user.name ? (
        <Box>
          <Box css={{ font: 'heading' }}>{user.name}</Box>
          <Box css={{ font: 'subheading' }}>{user.login}</Box>
        </Box>
      ) : (
        <Box css={{ font: 'heading' }}>{user.login}</Box>
      )}
      <SingleSection item={user.email} label="Email" />
      <SingleSection item={user.bio} label="Bio" />
      <SingleSection item={user.company} label="Company" />
      <ListSection items={user.organizations.nodes} label="Organizations" />
      <ListSection items={user.projects.nodes} label="Projects" />
      <ListSection
        items={user.topRepositories.nodes}
        label="Top Repositories"
      />
      <SingleSection item={user.twitterUsername} label="Twitter" />
      <SingleSection item={user.websiteUrl} label="Website" />
    </Box>
  );
};
