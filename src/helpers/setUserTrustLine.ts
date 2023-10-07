import * as xrpl from 'xrpl';
import { submitBulkTransactions } from '@gemwallet/api';

type TransactionWithID = xrpl.Transaction & { 
  ID?: string
};

export default async function setUserTrustLine(userAddress: string, issuerAddress: string, domain: string, token: string) {
    try {
        const transactions: TransactionWithID[] = [
          {
            ID: '001',
            "TransactionType": "AccountSet",
            "Account": userAddress,
            "Domain": xrpl.convertStringToHex(domain),
            "SetFlag": xrpl.AccountSetAsfFlags.asfRequireAuth,
          },
          {
            ID: '002',
            "TransactionType": "TrustSet",
            "Account": userAddress,
            "LimitAmount": {
              "currency": token,
              "issuer": issuerAddress,
              "value": "10000000000" // Large limit, arbitrarily chosen
            }
          }
        ];

        submitBulkTransactions({
          transactions,
          onError: 'abort',
          waitForHashes: true
        }).then((response) => {
          console.log('Received response: ', response);
        }).catch((error) => {
          console.error("Transactions submission failed", error);
        });

    } catch (error) {
        console.log('Error setting users hot wallet.', error);
    }
}