import { isEmpty } from "lodash";
import axios from 'axios';
import { CLIENT_ID_DISCORD, CLIENT_SECRET_DISCORD, REDIRECT_URI_DISCORD } from "../../src/config/config";

export default async function handler(req, res) {

    const responseData = {
        success: false,
        error: '',
        data: {}
    }

    if (isEmpty(req.query)) {
        responseData.error = 'Required data not sent';
        return responseData
    }
    const { code } = req.query;

    try {

        const tokenResponseData = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: CLIENT_ID_DISCORD,
            client_secret: CLIENT_SECRET_DISCORD,
            code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI_DISCORD,
            scope: 'identify',
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const oauthData = await tokenResponseData.data;

        const userResult = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
            },
        });

        res.redirect(307, `/my-account?discordId=${userResult.data.id}`)

    } catch (error) {
        /**
         * Request usually fails if the data in req.body is not sent in the format required.
         *
         * @see Data shape expected: https://stackoverflow.com/questions/49349396/create-an-order-with-coupon-lines-in-woocomerce-rest-api
         */
        responseData.error = error.message;
        console.error(error);
        res.status(500).json(responseData);
    }
}