import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { theme } from 'theme';
import { ThemeProvider } from 'theme-ui';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from 'components/UserContext';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GlobalStyle } from 'GlobalStyle';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (e) => {
        console.error(e);
      },
    },
  },
});

ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <GlobalStyle />
            <App />
          </UserProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
