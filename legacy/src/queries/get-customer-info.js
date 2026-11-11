import { gql } from "@apollo/client";
const GET_CUSTOMER_INFO = gql`
    query GET_CUSTOMER_INFO( $customerId: Int ) {
        customer( customerId: $customerId ) {
            id
            databaseId
            metaData(key: "dwpp-discord-id") {
                key
                value
            }
        }
    }
`;

export default GET_CUSTOMER_INFO;

