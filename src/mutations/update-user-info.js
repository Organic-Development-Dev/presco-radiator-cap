import { gql } from "@apollo/client";

const UPDATE_USER_INFO = gql`
mutation UPDATE_USER_INFO($input: UpdateUserInput!) {
  updateUser(input: $input) {
    user {
      databaseId
      firstName
      id
      email
      jwtAuthToken
      jwtRefreshToken
      lastName
      name
      username
    }
  }
}
`;

export default UPDATE_USER_INFO;
