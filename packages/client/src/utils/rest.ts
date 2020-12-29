import { HTTP_URL } from '../lib/resources';

export const post = (path: string, payload: object) =>
  fetch(`${HTTP_URL}${path}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json());
