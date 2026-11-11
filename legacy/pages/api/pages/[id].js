import { isEmpty } from 'lodash';
import axios from 'axios';
import {
  NEXT_PUBLIC_WORDPRESS_SITE_URL,
  WC_CONSUMER_KEY,
  WC_CONSUMER_SECRET,
} from '../../../src/config/config';
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: 'wp/v2',
});

export default async function handler(req, res) {
  const { id } = req.query;
  const responseData = {
    success: false,
    error: '',
    data: {},
  };

  //   if (isEmpty(req.body)) {
  //     responseData.error = 'Required data not sent';
  //     return responseData;
  //   }

  try {
    const response = await api.get(`pages/${id}`);
    res.json(response?.data ?? []);
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
