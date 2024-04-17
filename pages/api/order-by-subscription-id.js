import { isEmpty } from "lodash";
import axios from 'axios';
import { NEXT_PUBLIC_WORDPRESS_SITE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } from "../../src/config/config";
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const api = new WooCommerceRestApi({
    url: NEXT_PUBLIC_WORDPRESS_SITE_URL,
    consumerKey: WC_CONSUMER_KEY,
    consumerSecret: WC_CONSUMER_SECRET,
    version: 'wc/v3',
});

export default async function handler(req, res) {

    const responseData = {
        success: false,
        error: '',
        user_id: '',
        data: {}
    }

    if (isEmpty(req.body)) {
        responseData.error = 'Required data not sent';
        return responseData
    }


    const data = req.body;

    try {
        const response = await api.get(`subscriptions/${data.subscriptionId}/orders`);
        res.json(response?.data ?? [])
    } catch (error) {
        /**
         * Request usually fails if the data in req.body is not sent in the format required.
         *
         * @see Data shape expected: https://stackoverflow.com/questions/49349396/create-an-order-with-coupon-lines-in-woocomerce-rest-api
         */
        responseData.success = false;
        responseData.error = error.message;
        res.status(500).json(responseData);
    }
}