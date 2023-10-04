import { Client, AccountQueueData, AccountTxTransaction, AccountLinesTrustline } from 'xrpl';

interface AccountData {
    balance: string;
    transactions?: AccountTxTransaction[];
    isHookSet?: boolean;
    tokenBalances?: AccountLinesTrustline[];
};

const hookNameHex = "7AEB2095209A73B301DED61BE93A974FCA6327CAF7D6B8C0F7F67856F6891D2C";

export default async function getWalletDetails(address: string) : Promise<AccountData> {
    try {

        const client = new Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();

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

        const token_balances = await client.request({
            command: "account_lines",
            account: address,
            ledger_index: "validated"
        })

        // console.log('token_balances', token_balances.result);

        return {
            balance: accountData.result?.account_data.Balance,
            transactions: acountTxns.result?.transactions,
            isHookSet,
            tokenBalances: token_balances.result?.lines,
        }
    } catch (error) {
        console.log('Error getting wallet details', error);
        return {
            balance: '0',
            transactions: undefined,
            isHookSet: false,
            tokenBalances: [],
        }
    }
}