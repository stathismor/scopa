export const PORT = 3001;
export let HOSTS = [''];

if (process.env.NODE_ENV === 'production') {
  HOSTS = ['https://our.production.domain1.com', 'https://our.production.domain2.com'];
} else {
  HOSTS = ['https://localhost'];
}
