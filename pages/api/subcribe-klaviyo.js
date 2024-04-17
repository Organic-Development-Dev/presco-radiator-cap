import { isEmpty } from "lodash";
import { API_KEY_KLAVIYO } from "../../src/config/config";

export default async function handler(req, res) {

    const responseData = {
        success: false,
        error: '',
        data: {}
    }

    if ( isEmpty(req.body) ) {
        responseData.error = 'Required data not sent';
        return responseData
    }

    const data = req.body;
    

    try {

        const options = {
            method: 'POST',
            headers: {accept: 'application/json', 'content-type': 'application/json'},
            body: JSON.stringify({profiles: [data]})
        };
        const resData = await fetch(`https://a.klaviyo.com/api/v2/list/VWNXTb/subscribe?api_key=${API_KEY_KLAVIYO}`, options)
        responseData.success = true;
        responseData.data = resData;
        res.json(responseData)

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
