import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER_API_BOT = gql`
mutation UPDATE_CUSTOMER_API_BOT($input: UpdateCustomerApiBotInput!) {
  updateCustomerApiBot(input: $input) {
    clientMutationId
    customer {
      userapiId
      userapiStatus
      exchange
    }
  }
}
`;

export const UPDATE_CUSTOMER_API_BOT_BINANCE = gql`
mutation UPDATE_CUSTOMER_API_BOT_BINANCE($input: UpdateCustomerApiBotBinanceInput!) {
  updateCustomerApiBotBinance(input: $input) {
    clientMutationId
    customer {
      userapiId
      exchange
      exchangeApiKeyBinance
      exchangeSecretKeyBinance
    }
  }
}
`;

export const UPDATE_CUSTOMER_API_BOT_BITGET = gql`
mutation UPDATE_CUSTOMER_API_BOT_BINANCE($input: UpdateCustomerApiBotBitgetInput!) {
  updateCustomerApiBotBitget(input: $input) {
    clientMutationId
    customer {
      userapiId
      exchange
      exchangeApiKeyBitget
      exchangeSecretKeyBitget
      exchangeBitgetPassphrase
    }
  }
}
`;

export const UPDATE_CUSTOMER_API_BOT_BYBIT = gql`
mutation UPDATE_CUSTOMER_API_BOT_BINANCE($input: UpdateCustomerApiBotBybitInput!) {
  updateCustomerApiBotBybit(input: $input) {
    clientMutationId
    customer {
      userapiId
      exchange
      exchangeApiKeyBybit
      exchangeSecretKeyBybit
    }
  }
}
`;


