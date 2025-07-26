import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_WS_ENDPOINT || 'ws://localhost:4000/graphql',
    connectionParams: {
      // Add auth headers or other params if needed
    },
  })
);

export default wsLink;
