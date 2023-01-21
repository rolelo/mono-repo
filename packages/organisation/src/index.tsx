import {
  ApolloClient, ApolloProvider, createHttpLink, InMemoryCache
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Amplify from 'common/services/Amplify';
import { Amplify as AmplifyMain } from 'aws-amplify';
import awsExports from 'common/utils/aws-exports';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await Amplify.verifyUser();
  return {
    headers: {
      ...headers,
      authorization: token || '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient();
AmplifyMain.configure(awsExports);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
