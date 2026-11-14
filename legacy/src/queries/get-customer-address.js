import { gql } from "@apollo/client";
const GET_CUSTOMER_ADDRESS = gql`
    query GET_CUSTOMER_ADDRESS( $customerId: Int ) {
        customer( customerId: $customerId ) {
            id
            databaseId
            billing {
                firstName
                lastName
                address1
                address2
                city
                postcode
                state
                country
            }
            shipping {
                firstName
                lastName
                address1
                address2
                city
                postcode
                state
            }
        }
    }
`;

export default GET_CUSTOMER_ADDRESS;

