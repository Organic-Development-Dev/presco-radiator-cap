
import { gql } from "@apollo/client";
const GET_USER_INFO = gql`
query GET_USER_INFO($id: ID!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
    name
    username
    databaseId
    user_id_new {
        exchange
        exchangeApiKeyBinance
        exchangeSecretKeyBinance
        exchangeApiKeyBybit
        exchangeSecretKeyBybit
        exchangeApiKeyBitget
        exchangeSecretKeyBitget
        exchangeBitgetPassphrase
        userApiId
      }
    roles {
        nodes {
        displayName
        id
        name
        capabilities
        isRestricted
        }
    }
  }
}
`;

export default GET_USER_INFO;

