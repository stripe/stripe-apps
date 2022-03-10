export interface GithubUser {
  login: string;
  name?: string;
  bio?: string;
  company?: string;
  email?: string;
  organizations: {
    nodes: {
      name: string;
    }[];
  };
  projects: {
    nodes: {
      name: string;
    }[];
  };
  topRepositories: {
    nodes: {
      name: string;
    }[];
  };
  twitterUsername?: string;
  websiteUrl?: string;
}

export interface GithubData {
  user: GithubUser;
}
