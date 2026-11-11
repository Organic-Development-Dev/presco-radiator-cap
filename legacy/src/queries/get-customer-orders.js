import { gql } from "@apollo/client";
const GET_CUSTOMER_ORDER = gql`
    query GET_CUSTOMER_ORDER( $customerId: Int ) {
        customer( customerId: $customerId ) {
            id
            databaseId
            orders {
                edges {
                    node {
	                    id
	                    databaseId
                        orderKey
                        date
                        status
                        total
                        customerNote
                        paymentMethodTitle
                        lineItems {
                            edges {
                                node {
                                    product {
                                        node {
                                            name
                                            id
                                          }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default GET_CUSTOMER_ORDER;

