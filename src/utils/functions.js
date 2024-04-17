import DOMPurify from 'dompurify';
import { isEmpty } from "lodash";
import CryptoJS from 'crypto-js';
import {
    NEXT_PUBLIC_WORDPRESS_SITE_URL,
    REFRESH_TOKEN_LS_KEY,
    WC_CONSUMER_KEY,
    WC_CONSUMER_SECRET,
    SITE_API_KEY_TAWK
} from "../config/config";
import axios from "axios";
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const api = new WooCommerceRestApi({
    url: NEXT_PUBLIC_WORDPRESS_SITE_URL,
    consumerKey: WC_CONSUMER_KEY,
    consumerSecret: WC_CONSUMER_SECRET,
    version: 'wc/v3',
});

export const genHashTawkApi = (userId) => {
    var hash = CryptoJS.HmacSHA256(userId.toString(), SITE_API_KEY_TAWK);
	return CryptoJS.enc.Hex.stringify(hash);
}

export const isUserLoggedIn = () => {
    let authData = null;

    if (process.browser) {
        authData = JSON.parse(localStorage.getItem("auth"));
    }
    return authData;
};

export const logOut = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem(REFRESH_TOKEN_LS_KEY);

};

export const setAuth = (authData) => {
    localStorage.setItem("auth", JSON.stringify(authData));
    localStorage.setItem(REFRESH_TOKEN_LS_KEY, JSON.stringify(authData.refreshToken));
};

/**
 * Check if user is logged in.
 *
 * @return {object} Auth Object containing token and user data, false on failure.
 */
export const isUserValidated = () => {
    let userLoggedInData = "";

    if (process.browser) {
        let authTokenData = localStorage.getItem("auth");

        if (!isEmpty(authTokenData)) {
            authTokenData = JSON.parse(authTokenData);

            if (!isEmpty(authTokenData.authToken)) {
                userLoggedInData = authTokenData;
            }
        }
    }

    return userLoggedInData;
};


/**
 * Sanitize markup or text when used inside dangerouslysetInnerHTML
 *
 * @param {string} content Plain or html string.
 *
 * @return {string} Sanitized string
 */
export const sanitize = (content) => {
    return process.browser ? DOMPurify.sanitize(content) : content
}


/**
 * Get date in format of m-d-y
 *
 * @param {string} dateString Date string, example 2020-05-03T04:41:12
 *
 * @return {string}
 */
export const getFormattedDate = (dateString) => {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

/**
 * Get Countries
 *
 * @return {Promise<void>}
 */
export const getCountries = async () => {
    return await api.get(
        'data/countries'
    );
};

export const getStates = async (countryCode = '') => {

    if (!countryCode) {
        return [];
    }

    const { data } = await api.get(`data/countries/${countryCode}`);

    return data?.states ?? [];
};


export const fetchChannelMessages = async (channelId) => {
    const botToken = 'MTEwNzU5ODA5NzU0NDEzODc1Mw.G43eOR.eXEZ0tk6vw92Xwwz_o4GcNyJNSRHzuRaH6ycyI';

    return await axios.get(`https://discord.com/api/v10/channels/${channelId}/messages?limit=10`, {
        headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
        },
    });
};


/**
 * Get Customer
 *
 * @return {Promise<void>}
 */
export const getCustomer = async (customerId = '') => {
    return await api.get(`customers/${customerId}`);
};

/**
 * Get Orders.
 *
 * @return {Promise<void>}
 */
export const getOrdersData = async () => {
    return await api.get(
        'orders'
    );
};

/**
 * Get Order By Id.
 *
 * @return {Promise<void>}
 */
export const getOrderById = async (orderId = '') => {
    return await api.get(`orders/${orderId}`);
};


/**
 * Get Subscriptions.
 *
 * @return {Promise<void>}
 */
export const getSubscriptionsData = async () => {
    return await api.get(
        'subscriptions'
    );
};

/**
 * Get Subscriptions By Id.
 *
 * @return {Promise<void>}
 */
export const getSubscriptionsById = async (subscriptionId = '') => {
    return await api.get(`subscriptions/${subscriptionId}`);
};

export const getOrderBySubscriptionId = async (subscriptionId = '') => {
    return await api.get(`subscriptions/${subscriptionId}/orders`);
}