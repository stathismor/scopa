export const HTTP_URL = process.env.REACT_APP_HTTP_URL;

export const http = {
  get: async (path: string, queryParams: Record<string, any> = {}) => {
    const queryString = Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join('&');
    const response = await fetch(`${HTTP_URL}${path}${queryString}`);
    return response.json();
  },
  delete: async (path: string, payload: Record<string, any>) => {
    const response = await fetch(`${HTTP_URL}${path}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },
};
