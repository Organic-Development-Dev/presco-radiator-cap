import { isEmpty } from "lodash";
import axios from 'axios';

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
    data.api_key = '2hAH3u3yyJZ66Enmkbv9nnpLkpJ7DbdC';

    try {

        const response = await axios.post("https://api.hermes.tradingtool.best/users.php?action=addUser", new URLSearchParams(data), {
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
        responseData.success = false;
        responseData.error = error.message;
        res.status(500).json(responseData);
    }
}