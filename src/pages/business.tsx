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
} from 'grommet';
import { Layout, PrimaryButton, Tasks } from '../components';
import { Chat, CreditCard, Scorecard, Search, Image, Print } from 'grommet-icons';
import { useEffect, useState } from 'react';
import { isInstalled, getAddress } from '@gemwallet/api'
import { toast } from 'react-toastify';
import { dropsToXrp, AccountTxTransaction, LedgerEntryResponse } from 'xrpl';
import getWalletDetails from '../helpers/getWalletDetails';

const data = [
    {rewardName: 'Reward 1', points: 10},
    {rewardName: 'Reward 2', points: 20, date: '2020-08-21'},
    {rewardName: 'Reward 3', points: 30, date: '2020-08-22'},
    {rewardName: 'Reward 4', points: 40, date: '2020-08-23'},
]

const dates = [{ date: '2020-08-20', amount: 2 }, { date: '2020-08-21', amount: 47 }, { date: '2020-08-22', amount: 33 }];

interface AccountData {
    balance: string;
    transactions?: AccountTxTransaction[];
    isHookSet?: boolean;
};

export default function BusinessPage() {
    const [showTab, setShowTab] = useState<'dashboard' | 'rewards' | 'settings'>('dashboard');
    const [rewards, setRewards] = useState<any[]>(data);
    const [showCreateReward, setShowCreateReward] = useState(false);
    const [showWalletSettings, setShowWalletSettings] = useState(false);
    const [installGemWallet, setInstallGemWallet] = useState(false);
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false); 
    const [hook, setHook] = useState(false);

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
        console.log(transactions);
        setHook(isHookSet ? true : false);
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
            const data = await response.json();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (address)
            loadUserData();
            loadStoreData();
      }, [address])
    
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
                                                                property: 'name',
                                                                header: <Text>Name</Text>,
                                                                primary: true,
                                                            },
                                                            {
                                                                property: 'percent',
                                                                header: 'Complete',
                                                                render: datum => (
                                                                <Box pad={{ vertical: 'xsmall' }}>
                                                                    <Meter
                                                                    values={[{ value: datum.percent }]}
                                                                    thickness="small"
                                                                    size="small"
                                                                    />
                                                                </Box>
                                                                ),
                                                            },
                                                            ]}
                                                            data={[
                                                                { name: 'Alan', percent: 20 },
                                                                { name: 'Bryan', percent: 30 },
                                                                { name: 'Chris', percent: 40 },
                                                                { name: 'Eric', percent: 80 },
                                                            ]}
                                                        />
                                                    </Box>
                                                </Box>
                                                <Box width="30%">
                                                    <Box border height="large" round="small" pad="medium" margin="small">
                                                        <Box direction="row" background="grey">
                                                            <Button>
                                                                Day
                                                            </Button>
                                                            <Button>
                                                                Week
                                                            </Button>
                                                            <Button>
                                                                Month
                                                            </Button>
                                                        </Box>
                                                        <Box fill="vertical">
                                                            <Text>
                                                                Data
                                                            </Text>
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
                                                    <Text>Rewards 10</Text>
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
                                                    gap="small"
                                                >
                                                    {
                                                        rewards.map((reward, index) => {
                                                            return (
                                                                <Box
                                                                    background="#FFFFFF"
                                                                    key={index}
                                                                    align="start"
                                                                    justify="center"
                                                                    round="small"
                                                                    elevation="large"
                                                                    pad="medium"
                                                                    margin={{ top: 'small' }}
                                                                    height={{ min: 'small' }}
                                                                    width="350px"
                                                                    border={{ color: 'black', size: 'small' }}
                                                                >
                                                                    <Box>
                                                                        Data
                                                                    </Box>
                                                                </Box>
                                                            );
                                                        })
                                                    }
                                                </Box>
                                            </Box>
                                        )
                                    }
                                    {
                                        showTab === 'settings' && (
                                            <Box width="85%" direction="row">
                                                <Header>Settings</Header>
                                                <Text>Set hook to your account to continue</Text>
                                                <TextInput placeholder="Token symbol"/>
                                                <TextInput placeholder="Reward ratio" type='number'/>
                                                <PrimaryButton label="Set Hook" onClick={() => setHook(true)}/>
                                            </Box>
                                        )
                                    }
                                    {
                                        showCreateReward && (
                                            <Layer responsive={true}>
                                                <Box width="xlarge">
                                                    <Text>Name</Text>
                                                    <Text>Description</Text>
                                                    <Text>Image</Text>
                                                    <Text>Price</Text>
                                                    <Button 
                                                        label="Close"
                                                        primary
                                                        onClick={() => setShowCreateReward(false)}
                                                    />
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
  