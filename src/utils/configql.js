import { ApolloLink, gql } from '@apollo/client';
import { GraphQLClient } from 'graphql-request';
import { AUTH_KEY_TIMEOUT, AUTH_TOKEN_LS_KEY, GRAPHQL_ENDPOINT, REFRESH_TOKEN_LS_KEY, SESSION_TOKEN_LS_KEY } from "../config/config";
import { GetCartDocument } from "../queries/get-cart-document";

const RefreshAuthTokenDocument = gql`
  mutation RefreshAuthToken($refreshToken: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) {
      authToken
    }
  }
`;

export function hasCredentials() {
    const authToken = sessionStorage.getItem(AUTH_TOKEN_LS_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_LS_KEY);

    if (!!authToken && !!refreshToken) {
        return true;
    }

    return false;
}

export async function getAuthToken() {
    let authToken = sessionStorage.getItem(AUTH_TOKEN_LS_KEY);
    if (!authToken || !tokenSetter) {
        authToken = await fetchAuthToken();
    }
    return authToken;
}

let tokenSetter;
async function fetchAuthToken() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_LS_KEY);
    if (!refreshToken) {
        // No refresh token means the user is not authenticated.
        return;
    }

    try {
        const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);

        const results = await graphQLClient.request(RefreshAuthTokenDocument, { refreshToken });

        const authToken = results?.refreshJwtAuthToken?.authToken;
        if (!authToken) {
            localStorage.removeItem(AUTH_TOKEN_LS_KEY)
            localStorage.removeItem(REFRESH_TOKEN_LS_KEY)
            throw new Error('Failed to retrieve a new auth token');
        }
    } catch (err) {
        localStorage.removeItem(AUTH_TOKEN_LS_KEY)
        localStorage.removeItem(REFRESH_TOKEN_LS_KEY)
        window.location.reload();
        console.error(err);
    }

    // Save token.
    sessionStorage.setItem(AUTH_TOKEN_LS_KEY, authToken);
    if (tokenSetter) {
        clearInterval(tokenSetter);
    }
    tokenSetter = setInterval(
        async () => {
            if (!hasCredentials()) {
                clearInterval(tokenSetter);
                return;
            }
            fetchAuthToken();
        },
        Number(AUTH_KEY_TIMEOUT || 30000),
    );

    console.log('vdvvv');

    return authToken;
}

async function fetchSessionToken() {
    const headers = {};
    const authToken = await getAuthToken();
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    let sessionToken;
    try {
        const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, { headers });

        const cartData = await graphQLClient.request(GetCartDocument);

        // If user doesn't have an account return accountNeeded flag.
        sessionToken = cartData?.cart?.sessionToken;

        if (!sessionToken) {
            throw new Error('Failed to retrieve a new session token');
        }
    } catch (err) {
        console.error(err);
    }

    return sessionToken;
}

const consoleLink = new ApolloLink((operation, forward) => {
    return operation.setContext(/* our callback */);
});


export async function getSessionToken(forceFetch = false) {
    let sessionToken = localStorage.getItem(SESSION_TOKEN_LS_KEY);
    if (!sessionToken || forceFetch) {
        sessionToken = await fetchSessionToken();
    }
    return sessionToken;
}



