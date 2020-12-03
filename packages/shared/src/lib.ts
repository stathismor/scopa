export const USER_EVENTS = {
  UsernameCreated: 'username-created',
  UsernameMissing: 'username-missing',
} as const;

export type UserEvents = typeof USER_EVENTS[keyof typeof USER_EVENTS];
