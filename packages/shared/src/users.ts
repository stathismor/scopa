export type Player = {
  name: string;
};

export const UserEvent = {
  UsernameCreated: 'username-created',
  UsernameMissing: 'username-missing',
} as const;
export type UserEvent = typeof UserEvent[keyof typeof UserEvent];
