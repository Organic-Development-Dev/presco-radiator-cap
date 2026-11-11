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

// Use built-in fetch for client side and node-fetch for server side
const customFetch = typeof window !== 'undefined' 
  ? window.fetch.bind(window) 
  : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
  // Safe localStorage access that works in SSR and CSR
  const getLocalStorageItem = (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Error reading localStorage key "${key}":`, e);
      }
      return null;
    }
  };

  // Initialize headers object
  let headersToAdd = {};
  
  // Get session from localStorage safely
  const session = getLocalStorageItem('woo-session');
  if (session) {
    headersToAdd['woocommerce-session'] = `Session ${session}`;
  }

  // Get auth token from localStorage safely
  try {
    const auth = getLocalStorageItem('auth') ? JSON.parse(getLocalStorageItem('auth')) : null;
    const token = !isEmpty(auth) ? auth.authToken : null;
    
    if (!isEmpty(token)) {
      headersToAdd.authorization = `Bearer ${token}`;
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Error parsing auth data:', e);
    }
  }

  // Apply headers if we have any to add
  if (!isEmpty(headersToAdd)) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...headersToAdd
      }
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
    // Only run in browser environment 
    if (typeof window === 'undefined') {
      return response;
    }

    // Safe localStorage operations
    const safeLocalStorage = {
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Error writing to localStorage key "${key}":`, e);
          }
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Error removing localStorage key "${key}":`, e);
          }
        }
      },
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Error reading localStorage key "${key}":`, e);
          }
          return null;
        }
      }
    };

    /**
     * Check for session header and update session in local storage accordingly.
     */
    try {
      const context = operation.getContext();
      const { response: { headers } } = context;
      
      // Safe access to headers
      if (headers && typeof headers.get === 'function') {
        const session = headers.get('woocommerce-session');
  
        if (session) {
          // Remove session data if session destroyed.
          if (session === 'false') {
            safeLocalStorage.removeItem('woo-session');
          }
          // Update session new data if changed.
          else if (safeLocalStorage.getItem('woo-session') !== session) {
            safeLocalStorage.setItem('woo-session', session);
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Error in Apollo afterware:', error);
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

// Singleton pattern for Apollo Client that's compatible with Next.js 14 and React 18
let apolloClient = null;

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? getApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client-side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

// Export the initialized Apollo Client
export default initializeApollo();
