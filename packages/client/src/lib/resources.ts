const HTTP_URL = process.env.REACT_APP_HTTP_URL;

export const getUsers = fetch(`${HTTP_URL}/users`).then((response) => response.json());
