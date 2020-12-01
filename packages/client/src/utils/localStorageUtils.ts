const USER_NAME = 'userName';

export function persistUserName(userName: string) {
  return localStorage.setItem(USER_NAME, userName);
}

export function getPersistedUserName() {
  return localStorage.getItem(USER_NAME);
}
