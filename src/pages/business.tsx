import {
    Box,
    Button,
    Heading,
    Layer,
    Menu,
    Paragraph,
    TextInput,
    Text,
    ResponsiveContext,
    Spinner,
    DataTable,
    Meter,
    DataChart,
    Main,
    Header,
    Form,
    FormField,
} from 'grommet';
import { Layout, PrimaryButton, Tasks } from '../components';
import { Chat, CreditCard, Scorecard, Search, Image, Print } from 'grommet-icons';
import { useEffect, useState } from 'react';
import { isInstalled, getAddress } from '@gemwallet/api'
import { toast } from 'react-toastify';
import { dropsToXrp, AccountTxTransaction, LedgerEntryResponse, Client, AccountLinesResponse, AccountLinesTrustline } from 'xrpl';
import getWalletDetails from '../helpers/getWalletDetails';
import setTokenIssuer from '../helpers/setTokenIssuer';
import { Reward } from '../components/Reward';
import Head from 'next/head';

const dates = [{ date: '2020-08-20', amount: 2 }, { date: '2020-08-21', amount: 47 }, { date: '2020-08-22', amount: 33 }];

interface AccountData {
    balance: string;
    transactions?: AccountTxTransaction[];
    isHookSet?: boolean;
    tokenBalances?: AccountLinesTrustline[];
};

export default function BusinessPage() {
    const [showTab, setShowTab] = useState<'dashboard' | 'rewards' | 'settings'>('dashboard');
    const [rewards, setRewards] = useState<any[]>([]);
    const [showCreateReward, setShowCreateReward] = useState(false);
    const [showWalletSettings, setShowWalletSettings] = useState(false);
    const [installGemWallet, setInstallGemWallet] = useState(false);
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false); 
    const [hook, setHook] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [transactions, setTransactions] = useState<any>([]);
    const [storeName, setStoreName] = useState('');
    const [storeNameFromDB, setStoreNameFromDB] = useState('');
    const [domain, setDomain] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');

    const connectWallet = async () => {
        const installed = await isInstalled();
        if (installed.result.isInstalled) {
          getAddress().then((response) => {
            response.result ? setAddress(response.result.address) : setAddress('');
            setIsConnected(true);
            setInstallGemWallet(false);
          });
        } else {
            setInstallGemWallet(true);
        }
    }
    
    const loadUserData = async () => {
        setIsLoadingUserData(true);
        const { balance, transactions, isHookSet }: AccountData = await getWalletDetails(address);        


        const filteredTxns = transactions ? transactions?.filter((transaction) => transaction.tx?.TransactionType === 'Payment') : [];

        const filteredTxnsData = filteredTxns?.map((txn) => {
            return {
                from: txn.tx?.Account === address ? 'You' : txn.tx?.Account,
                to: txn.tx?.Destination ? (txn.tx?.Destination === address ? 'You' : txn.tx?.Destination) : '',
                currency: txn.tx?.Amount.currency ? txn.tx?.Amount.currency : 'XRP',
                amount: txn.tx?.Amount.value ? txn.tx?.Amount.value : dropsToXrp(txn.tx?.Amount), 
            }
        });

        setTransactions(filteredTxnsData);


        // setHook(isHookSet ? true : false);
        setHook(true);
        if (!isHookSet) {
            setShowTab('settings');
        }
        setBalance(
            Number(dropsToXrp(balance)).toFixed(2)
        );
        setIsLoadingUserData(false);
    };

    const loadStoreData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/loadStoreData?wallet=${address}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                const data = await response.json();
                setStoreNameFromDB(data.name);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const createStore = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/createStore`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        wallet: address,
                        name: storeName,
                        domain: domain,
                        token: tokenSymbol
                    })
                }
            );
            if (response.status === 200) {
                setStoreNameFromDB(storeName);
                setDomain(domain);
                setTokenSymbol(tokenSymbol);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const loadRewards = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/loadRewards?wallet=${address}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await response.json();
            console.log(data);
            setRewards(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (address) {
            loadUserData();
            loadStoreData();
            loadRewards();
        }
      }, [address])

    const handleAddReward = async () => {
        const newReward = await fetch(`http://localhost:3000/api/addReward`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wallet: address,
                    name: name,
                    description,
                    price
                })
            }
        );

        const data = await newReward.json();
        console.log(data);

        setShowCreateReward(false);
    }
    
    return (
        <Box>
            { showWalletSettings && (
                <Layer onEsc={() => setShowWalletSettings(false)}>
                    <Box align="center" justify="center" pad="large" gap="medium">
                        <Heading level="3">Wallet Settings</Heading>
                        <Box align="start" gap="xsmall">
                        <Text>
                            <b>Wallet Address:</b> {address}
                        </Text>
                        <Text>
                            <b>XRP: </b>
                            {balance}
                        </Text>
                        </Box>
                        <Box direction="row" alignSelf="end" gap="small">
                        <Button
                            secondary
                            label="Go Back"
                            onClick={() => setShowWalletSettings(false)}
                        />
                        </Box>
                    </Box>
                </Layer>
            )}
            <Header
                direction="row"
                align="center"
                justify="evenly"
                pad={{ vertical: 'small', horizontal: 'xlarge' }}
                border="bottom"
                gap="xlarge"
                background="#FFFFFF"
                height="xsmall"
            >
                <Box width="small">
                LOGO
                </Box>
                <Button
                    primary
                    label={
                        isConnected && address
                        ? address.slice(0, 6) + '...' + address.slice(-4) + ' ' + balance + ' XRP'
                        : 'Connect Wallet'
                    }
                    pad="xsmall"
                    onClick={
                        isConnected
                        ? () => {
                            setShowWalletSettings(true);
                            }
                        : () => {
                            connectWallet();
                            }
                    }
                />
            </Header>
            <Main>
                {
                    isConnected ? (
                        isLoadingUserData ? (<Box><Spinner /></Box>) : (
                            <Box fill>
                                <Box direction="row-responsive" width="100%" margin={{top: 'small'}} >
                                    <Box width="15%" height="large">
                                        <Box 
                                            gap="medium" 
                                            border                   
                                            fill="vertical" 
                                            align="center"
                                            round="small"
                                            margin="small"
                                            pad={{vertical: 'medium'}}
                                        >
                                            <Button
                                                onClick={() => setShowTab('dashboard')}
                                                label="Dashboard"
                                                primary={showTab === 'dashboard'}
                                                plain={showTab !== 'dashboard'}
                                                disabled={!hook}
                                            />
                                            <Button
                                                onClick={() => setShowTab('rewards')}
                                                label="Rewards"
                                                primary={showTab === 'rewards'}
                                                plain={showTab !== 'rewards'}
                                                disabled={!hook}
                                            />   
                                            <Button
                                                onClick={() => setShowTab('settings')}
                                                label="Settings"
                                                primary={showTab === 'settings'}
                                                plain={showTab !== 'settings'}
                                            />                      
                                        </Box>
                                    </Box>
                                    {
                                        showTab === 'dashboard' && (
                                            <Box width="85%" direction="row">
                                                <Box width="70%">
                                                    <Box border round="small" pad="medium" margin="small">
                                                        <DataChart
                                                            data={dates}
                                                            series={['date', 'amount']}
                                                            chart={[
                                                                { property: 'amount', type: 'line', opacity: 'medium', thickness: 'xsmall', color: 'brand' },
                                                                { property: 'amount', type: 'point', point: 'circle', thickness: 'medium' }
                                                            ]}
                                                            guide={{ x: { granularity: 'fine' } }}
                                                            detail
                                                            size={{ width: 'fill' }}
                                                        />
                                                    </Box>
                                                    <Box border round="small" pad="medium" margin="small"s>
                                                        <DataTable
                                                            columns={[
                                                            {
                                                                property: 'from',
                                                                header: <Text>From</Text>,
                                                                primary: true,
                                                            },
                                                            {
                                                                property: 'to',
                                                                header: <Text>To</Text>,
                                                            },
                                                            {
                                                                property: 'currency',
                                                                header: <Text>Currency</Text>,
                                                            },
                                                            {
                                                                property: 'amount',
                                                                header: <Text>Amount</Text>,
                                                            },
                                                            ]}
                                                            data={transactions}
                                                        />
                                                    </Box>
                                                </Box>
                                                <Box width="30%">
                                                    <Box border height="large" round="small" pad="medium" margin="small">
                                                        <Box fill="vertical" align="center">
                                                            <Heading level="3">Total transactions</Heading>
                                                            <Text size="large">{transactions?.length}</Text>
                                                        </Box>
                                                    </Box>
                                                </Box>            
                                            </Box>
                                        )
                                    }
                                    {
                                        showTab === 'rewards' && (
                                            <Box width="85%">
                                                <Box 
                                                    pad="medium"
                                                    margin="small"
                                                    direction="row-responsive"
                                                    justify="between"    
                                                >
                                                    <Text>Rewards {rewards.length}</Text>
                                                    <Text>Search</Text>
                                                    <Button
                                                        label="Add Reward"
                                                        primary
                                                        onClick={() => setShowCreateReward(true)}
                                                    />
                                                </Box>
                                                <Box             
                                                    direction="row-responsive"
                                                    wrap
                                                    align="center"
                                                    justify="center"
                                                >
                                                    {
                                                        rewards.map((reward, index) => {
                                                            return (
                                                                <Reward
                                                                    key={index}
                                                                    name={reward.name}
                                                                    points={reward.price}
                                                                    description={reward.description}
                                                                    isCustomer={false}
                                                                />
                                                            );
                                                        })
                                                    }
                                                </Box>
                                            </Box>
                                        )
                                    }
                                    {
                                        showTab === 'settings' && (
                                            <Box
                                                width="85%"
                                                align="center"
                                            >
                                                <Heading level="3">Settings</Heading>
                                                <Box direction="row-responsive" gap="large" pad="medium">
                                                    {
                                                        (!storeNameFromDB || !domain || !tokenSymbol) && (
                                                            <Box align="center">
                                                                <Heading level="4">Set Store Data</Heading>
                                                                <FormField name="storeName" label="Store Name" required>
                                                                    <TextInput name="storeName" onChange={(event) => setStoreName(event.target.value)}/>
                                                                </FormField>
                                                                <FormField name="domain" label="Store Domain" required>
                                                                    <TextInput name="domain" onChange={(event) => setDomain(event.target.value)}/>
                                                                </FormField>
                                                                <FormField name="tokenName" label="Token Name" required>
                                                                    <TextInput name="tokenName" onChange={(event) => setTokenSymbol(event.target.value)}/>
                                                                </FormField>
                                                                <PrimaryButton
                                                                    label="Set Data"
                                                                    disabled={!storeName || !domain || !tokenSymbol}
                                                                    onClick={() => createStore()}
                                                                />
                                                            </Box>
                                                        )
                                                    }
                                                    <Box align="center">
                                                        <Heading level="4">Set Token</Heading>
                                                        <PrimaryButton
                                                            label="Set token issuer"
                                                            disabled={!domain || !storeNameFromDB}
                                                            onClick={() => setTokenIssuer(address, domain)}
                                                        />
                                                    </Box>
                                                    <Box align="center">
                                                        <Heading level="4">Set Hook</Heading>
                                                        <TextInput placeholder="Reward ratio" type='number'/>
                                                        <PrimaryButton label="Set Hook"/>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        )
                                    }
                                    {
                                        showCreateReward && (
                                            <Layer responsive={true} onClickOutside={() => setShowCreateReward(false)}>
                                                <Box width="xlarge" pad="large" border>
                                                    <Form>
                                                        <FormField name="name" label="Reward name" required>
                                                            <TextInput name="name" onChange={(event) => setName(event.target.value)}/>
                                                        </FormField>
                                                        <FormField name="description" label="Description" required>
                                                            <TextInput name="description" onChange={(event) => setDescription(event.target.value)}/>
                                                        </FormField>
                                                        <FormField name="price" label="Price" required>
                                                            <TextInput type="number" name="price" onChange={(event) => setPrice(Number(event.target.value))}/>
                                                        </FormField>
                                                        <Box direction="row" justify="between">
                                                            <Button 
                                                                label="Add Reward"
                                                                primary
                                                                onClick={() => handleAddReward()}
                                                            />
                                                            <Button 
                                                                label="Close"
                                                                primary
                                                                onClick={() => setShowCreateReward(false)}
                                                            />
                                                        </Box>

                                                    </Form>
                                                </Box>
                                            </Layer>
                                        )
                                    }
                                </Box>
                            </Box>  
                        )                       
                    )
                    : (
                        <Box fill align="center" justify="center">
                            <Box width="medium" gap="medium">
                                <Text>
                                    Connect your wallet to continue
                                </Text>
                                { installGemWallet && (
                                    <Text>
                                        Install gem wallet
                                    </Text>
                                )}
                            </Box>
                        </Box>
                    )
                }         
            </Main>
        </Box>
    );
}
  