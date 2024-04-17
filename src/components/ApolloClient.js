import fetch from 'node-fetch';
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

  console.log(token);

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
  ({ graphQLErrors, operation, forward }) => {
    const targetErrors = [
      'The iss do not match with this server',
      'invalid-secret-key | Expired token',
      'invalid-secret-key | Signature verification failed',
      'Expired token',
      'Wrong number of segments',
    ];
    let observable;
    if (graphQLErrors?.length) {
      graphQLErrors.map(({ debugMessage, message }) => {
        if (
          targetErrors.includes(message) ||
          targetErrors.includes(debugMessage)
        ) {
          observable = new Observable((observer) => {
            getSessionToken(true)
              .then((sessionToken) => {
                operation.setContext(({ headers = {} }) => {
                  const nextHeaders = headers;

                  if (sessionToken) {
                    nextHeaders[
                      'woocommerce-session'
                    ] = `Session ${sessionToken}`;
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
                observer.error(error);
              });
          });
        }
      });
    }
    return observable;
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

// Apollo GraphQL client.
const client = new ApolloClient({
  link: from([
    middleware,
    afterware,
    createErrorLink,
    // createUpdateLink,
    createHttpLink({
      uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
      fetch: fetch,
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
