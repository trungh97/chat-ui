import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import wsLink from './wsLink';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_ENDPOINT,
  credentials: 'include',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_SERVER_ENDPOINT,
  link: splitLink,
  cache: new InMemoryCache(),
  credentials: 'include',
});

export default apolloClient;
