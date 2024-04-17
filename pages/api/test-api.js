import { isEmpty } from "lodash";
import axios from 'axios';

export default async function handler(req, res) {

    const responseData = {
        success: false,
        error: '',
        data: {}
    }

    if (isEmpty(req.body)) {
        responseData.error = 'Required data not sent';
        return responseData
    }


    const data = {};
    if(req.body.exchange === 'bitget') {
        data.exchange = req.body.exchange;
        data.user_id = req.body.userapiId;
        data.exchange_api_key = req.body.exchangeApiKeyBitget;
        data.exchange_secret_key = req.body.exchangeSecretKeyBitget;
        data.exchange_passphrase = req.body.exchangeBitgetPassphrase;
    } else if (req.body.exchange === 'binance') {
        data.exchange = req.body.exchange;
        data.user_id = req.body.userapiId;
        data.exchange_api_key = req.body.exchangeApiKeyBinance;
        data.exchange_secret_key = req.body.exchangeSecretKeyBinance;
    } else {
        data.exchange = req.body.exchange;
        data.user_id = req.body.userapiId;
        data.exchange_api_key = req.body.exchangeApiKeyBybit;
        data.exchange_secret_key = req.body.exchangeSecretKeyBybit;
    }
    data.api_key = '2hAH3u3yyJZ66Enmkbv9nnpLkpJ7DbdC';
    data.test_api_key = true

    try {

        const response = await axios.post("https://api.hermes.tradingtool.best/users.php?action=testApi", new URLSearchParams(data), {
            auth: {
                username: 'userapi',
                password: '7AFoKA4vhttYb6dh'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        responseData.success = response.status === 200;
        res.json(response.data)


    } catch (error) {
        /**
         * Request usually fails if the data in req.body is not sent in the format required.
         *
         * @see Data shape expected: https://stackoverflow.com/questions/49349396/create-an-order-with-coupon-lines-in-woocomerce-rest-api
         */
        responseData.error = error.message;
        res.status(500).json(responseData);
    }
}