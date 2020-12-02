export const USER_EVENTS = {
  UserNameCreated: 'username-created',
  UserNameMissing: 'username-missing',
} as const;

export type UserEvents = typeof USER_EVENTS[keyof typeof USER_EVENTS];
