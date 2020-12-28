const HTTP_URL = process.env.REACT_APP_HTTP_URL;

export const getRooms = fetch(`${HTTP_URL}/rooms`).then((response) => response.json());
