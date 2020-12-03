const USER_NAME = 'userName';

export function persistUsername(userName: string) {
  return localStorage.setItem(USER_NAME, userName);
}

export function getStoredUsername() {
  return localStorage.getItem(USER_NAME);
}
