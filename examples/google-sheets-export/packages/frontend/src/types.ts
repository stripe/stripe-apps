declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

export type UserInfo = {
  name: string;
  email: string;
};

export type State =
  | { name: 'initializing'; context: { stateKey: string } }
  | {
      name: 'logged-out';
      context: { stateKey: string; error?: string };
    }
  | { name: 'logging-out' }
  | { name: 'waiting-for-auth'; context: { stateKey: string } }
  | { name: 'logged-in'; context: { user: UserInfo; stateKey: string } };

export type Action =
  | { type: 'initialized'; payload: { user: UserInfo | null } }
  | { type: 'log-in' }
  | { type: 'authorized' }
  | { type: 'log-out' }
  | { type: 'session-deleted' }
  | { type: 'log-out-with-error'; payload: { error: string } }
  | { type: 'remove-error' };

interface CategoryField {
  key: string;
  label: string;
}

export interface ExportCategory {
  key: string;
  label: string;
  fields?: CategoryField[];
}

export interface UserContext {
  id: string;
  email?: string | undefined;
  name?: string | undefined;
  account: {
    id: string;
    name: string;
  };
}
