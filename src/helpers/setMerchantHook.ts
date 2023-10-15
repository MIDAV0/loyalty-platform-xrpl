import * as xrpl from 'xrpl';
import { signTransaction, SignTransactionResponse, submitBulkTransactions } from '@gemwallet/api';

type TransactionWithID = xrpl.Transaction & { 
    ID?: string
};

export default async function setMerchantHook(address: string, domain: string) {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    try {
        const transactions: TransactionWithID[] = [
            {
              ID: '001',
              "TransactionType": "AccountSet",
              "Account": address,
              "TransferRate": 0,
              "TickSize": 5,
              "Domain": xrpl.convertStringToHex(domain),
            },
            // {
            //   ID: '002',
            //   // @ts-ignore
            //   "TransactionType": "SetHook",
            //   "Account": "r4GDFMLGJUKMjNhhycgt2d5LXCdXzCYPoc",
            //   "Fee": "2000000",
            //   "Hooks":
            //   [        
            //       {                        
            //           "Hook": {                
            //               "CreateCode": fs.readFileSync('accept.wasm').toString('hex').toUpperCase(),
            //               "HookOn": '0000000000000000',
            //               "HookNamespace": addr.codec.sha256('accept').toString('hex').toUpperCase(),
            //               "HookApiVersion": 0,
            //               "HookParameters":
            //               [   
            //                   {   
            //                       "HookParameter":
            //                       {   
            //                           "HookParameterName":  "ABCDEF12",
            //                           "HookParameterValue": "12345678"
            //                       }   
            //                   },  
            //               ]
            //           }
            //       }
            //   ]
            // }
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
        console.log('Error setting token issuer', error);
    }
}