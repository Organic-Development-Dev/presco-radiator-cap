import { gql } from "@apollo/client";
const GET_CUSTOMER_SUBSCRIPTIONS = gql`
    query GET_CUSTOMER_SUBSCRIPTIONS( $customerId: Int ) {
        customer( customerId: $customerId ) {
            id
            databaseId
            subscriptions {
                total
                id
                databaseId
                status
                nextPaymentDate
                needsPayment
                lastPaymentDate
            }
        }
    }
`;

export default GET_CUSTOMER_SUBSCRIPTIONS;

