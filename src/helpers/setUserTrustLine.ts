import * as xrpl from 'xrpl';
import { setTrustline, SignTransactionResponse } from '@gemwallet/api';

export default async function setUserTrustline(client: xrpl.Client, issuerAddress: string, token: string) {
    try {
        const trustline = {
            limitAmount: {
              currency: token,
              issuer: issuerAddress,
              value: "10000000",
            },
            memos: [
              {
                memo: {
                  memoType: "4465736372697074696f6e",
                  memoData: "54657374206d656d6f",
                },
              },
            ],
            fee: "0",
            flags: {
              tfClearFreeze: false,
              tfClearNoRipple: false,
              tfSetFreeze: true,
              tfSetNoRipple: true,
              tfSetfAuth: false,
            },
        };

        // @ts-ignore
        setTrustline({ transaction }).then((response: SignTransactionResponse) => {
            console.log(response);
        }).catch((error: any) => {
            console.log(error);
        });

    } catch (error) {
        console.log('Error setting users hot wallet.', error);
    }
}