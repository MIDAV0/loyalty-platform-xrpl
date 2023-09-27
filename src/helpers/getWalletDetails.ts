import { Client, AccountQueueData, AccountTxTransaction } from 'xrpl';

interface AccountData {
    balance: string;
    transactions?: AccountTxTransaction[];
    isHookSet?: boolean;
};

const hookNameHex = "7AEB2095209A73B301DED61BE93A974FCA6327CAF7D6B8C0F7F67856F6891D2C";

export default async function getWalletDetails(address: string) : Promise<AccountData> {
    const client = new Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    try {

        const accountData = await client.request({
            command: 'account_info',
            account: address,
            ledger_index: 'validated',
        });

        if (!accountData.result?.account_data) {
            throw new Error('Account not found');
        }

        // @ts-ignore
        const isHookSet = accountData.result?.account_data?.HookNamespaces?.includes(hookNameHex) ? true : false;
        console.log('isHookSet', isHookSet);

        const acountTxns = await client.request({
            command: 'account_tx',
            account: address,
        })

        if (!acountTxns.result?.transactions) {
            throw new Error('Account transactions not found');
        }

        return {
            balance: accountData.result?.account_data.Balance,
            transactions: acountTxns.result?.transactions,
            isHookSet
        }
    } catch (error) {
        console.log('Error getting wallet details', error);
        return {
            balance: '0',
            transactions: undefined,
        }
    }
}