import { gql } from "@apollo/client";

const UPDATE_CUSTOMER = gql`
mutation UPDATE_CUSTOMER($input: UpdateCustomerInput!) {
  updateCustomer(input: $input) {
    clientMutationId
    customer {
      databaseId
      firstName
      id
      email
      jwtAuthToken
      jwtRefreshToken
      lastName
      username
    }
  }
}
`;

export default UPDATE_CUSTOMER;
