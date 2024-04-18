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