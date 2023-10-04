import * as xrpl from 'xrpl';
import { signTransaction, SignTransactionRequest, SignTransactionResponse } from '@gemwallet/api';
import { stringToHex } from './stringToHex';

export default async function setCustomerToToken(address: string, token: string, domain: string) {
    try {
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();
    
        const transaction = {
            "TransactionType": "AccountSet",
            "Account": address,
            "Domain": stringToHex(domain),
            "SetFlag": xrpl.AccountSetAsfFlags.asfRequireAuth,
            "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
                      xrpl.AccountSetTfFlags.tfRequireDestTag)
          }

        // @ts-ignore
        signTransaction({ transaction }).then((response: SignTransactionResponse) => {
            console.log(response);
        }).catch((error: any) => {
            console.log(error);
        });

    } catch (error) {
        console.log('Error setting users hot wallet.', error);
    }
}