// Use built-in fetch for client side and node-fetch for server side
const customFetch = typeof window !== 'undefined' ? window.fetch.bind(window) : require('node-fetch');

import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable,
  createHttpLink,
  from,
} from '@apollo/client';
import { isEmpty } from 'lodash';
import { onError } from '@apollo/client/link/error';
import { getSessionToken } from '../utils/configql';

/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
  let headersData = null;

  /**
   * If session data exist in local storage, set value as session header.
   */
  const session = process.browser ? localStorage.getItem('woo-session') : null;

  if (session) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        'woocommerce-session': `Session ${session}`,
      },
    }));
  }

  /**
   * If auth token exist in local storage, set value as authorization header.
   */
  const auth = process.browser
    ? JSON.parse(localStorage.getItem('auth'))
    : null;
  const token = !isEmpty(auth) ? auth.authToken : null;

  // Remove console log in production to avoid performance issues
  if (process.env.NODE_ENV !== 'production' && token) {
    console.log('Auth token available'); // More secure logging
  }

  if (!isEmpty(token)) {
    headersData = {
      ...headersData,
      authorization: token ? `Bearer ${token}` : '',
    };
  }

  if (!isEmpty(headersData)) {
    operation.setContext(({ headers = {} }) => ({
      headers: headersData,
    }));
  }

  return forward(operation);
});

export const createErrorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    const targetErrors = [
      'The iss do not match with this server',
      'invalid-secret-key | Expired token',
      'invalid-secret-key | Signature verification failed',
      'Expired token',
      'Wrong number of segments',
    ];
    
    // Handle network errors gracefully
    if (networkError) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[Network error]: ${networkError}`);
      }
      // Return null here to continue with error flow
      return null;
    }
    
    // Check for specific GraphQL errors that should trigger token refresh
    if (graphQLErrors?.length) {
      const shouldRefresh = graphQLErrors.some(({ debugMessage, message }) => 
        targetErrors.includes(message) || targetErrors.includes(debugMessage)
      );
      
      if (shouldRefresh) {
        return new Observable((observer) => {
          getSessionToken(true)
            .then((sessionToken) => {
              operation.setContext(({ headers = {} }) => {
                // Create a new headers object to avoid mutation issues
                const nextHeaders = { ...headers };

                if (sessionToken) {
                  nextHeaders['woocommerce-session'] = `Session ${sessionToken}`;
                } else {
                  delete nextHeaders['woocommerce-session'];
                }

                return {
                  headers: nextHeaders,
                };
              });
            })
            .then(() => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };
              forward(operation).subscribe(subscriber);
            })
            .catch((error) => {
              if (process.env.NODE_ENV !== 'production') {
                console.error('[Session refresh error]:', error);
              }
              observer.error(error);
            });
        });
      }
    }
    
    // If no specific errors to handle, return null to continue with error flow
    return null;
  }
);

export const afterware = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    if (!process.browser) {
      return response;
    }

    /**
     * Check for session header and update session in local storage accordingly.
     */
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;
    const session = headers.get('woocommerce-session');

    if (session) {
      // Remove session data if session destroyed.
      if ('false' === session) {
        localStorage.removeItem('woo-session');

        // Update session new data if changed.
      } else if (localStorage.getItem('woo-session') !== session) {
        localStorage.setItem('woo-session', headers.get('woocommerce-session'));
      }
    }

    return response;
  });
});

// Create a function to get a fresh Apollo Client instance
export function getApolloClient() {
  return new ApolloClient({
    link: from([
      middleware,
      afterware,
      createErrorLink,
      createHttpLink({
        uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
        fetch: customFetch,
        // Add additional safeguards for network errors
        fetchOptions: {
          timeout: 30000, // 30 second timeout
        },
        credentials: 'same-origin',
      }),
    ]),
    // Configure cache to prevent common issues
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Example for cart: Make sure it's always fresh data
            cart: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    // Disable in development to surface errors clearly
    connectToDevTools: process.env.NODE_ENV !== 'production',
  });
}

// Singleton instance for client side
let apolloClient = null;

// Get the singleton instance
function initializeApollo() {
  // Create a new client if none exists
  if (!apolloClient) {
    apolloClient = getApolloClient();
  }
  return apolloClient;
}

// Export a singleton client instance
// During server-side rendering, create a new client each time to avoid shared cache issues
// During client-side rendering, use the singleton pattern
const client = typeof window !== 'undefined' ? initializeApollo() : getApolloClient();

export default client;
