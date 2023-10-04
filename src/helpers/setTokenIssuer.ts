import * as xrpl from 'xrpl';
import { signTransaction, SignTransactionRequest, SignTransactionResponse } from '@gemwallet/api';
import { stringToHex } from './stringToHex';

export default async function setTokenIssuer(address: string, domain: string) {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    try {
        const transaction = {
            "TransactionType": "AccountSet",
            "Account": address,
            "TransferRate": 0,
            "TickSize": 5,
            "Domain": stringToHex(domain),
            "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
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
        console.log('Error setting token issuer', error);
    }
}