import {
  Box,
  Button,
  Heading,
  Layer,
  Text,
  Spinner,
  DataTable,
  DataChart,
  Main,
  Header,
} from 'grommet';
import { useEffect, useState } from 'react';
import { isInstalled, getAddress } from '@gemwallet/api'
import { toast } from 'react-toastify';
import { dropsToXrp, AccountTxTransaction, LedgerEntryResponse, Client, AccountLinesResponse, AccountLinesTrustline } from 'xrpl';
import getWalletDetails from '../helpers/getWalletDetails';
import setUserTrustLine from '../helpers/setUserTrustLine';
import { Reward } from '../components/Reward';
import { Store } from '../components/Store';

const dates = [{ date: '2020-08-20', amount: 2 }, { date: '2020-08-21', amount: 47 }, { date: '2020-08-22', amount: 33 }];

interface AccountData {
  balance: string;
  transactions?: AccountTxTransaction[];
  isHookSet?: boolean;
  tokenBalances?: AccountLinesTrustline[];
};

interface Store {
    id: string;
    wallet: string;
    name: string;
    domain: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}

type Reward = {
    name: string;
    description: string;
    price: number;
    storeWallet: string;
};

export default function CustomerPage() {
  const [showTab, setShowTab] = useState<'dashboard' | 'rewards' | 'settings'>('dashboard');
  const [rewards, setRewards] = useState<any[]>([]);
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const [installGemWallet, setInstallGemWallet] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false); 
  const [transactions, setTransactions] = useState<any>([]);
  const [tokenBalances, setTokenBalances] = useState<AccountLinesTrustline[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [isStoreLoading, setIsStoreLoading] = useState(false);
  const [isTrustLineSet, setIsTrustLineSet] = useState(false);


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
      const { balance, transactions, tokenBalances }: AccountData = await getWalletDetails(address);
      
      tokenBalances && setTokenBalances(tokenBalances);

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
      setBalance(
          Number(dropsToXrp(balance)).toFixed(2)
      );
      setIsLoadingUserData(false);
  };

  const loadStoreData = async () => {
      try {
          const response = await fetch(`http://localhost:3000/api/loadStores`,
              {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              }
          );
          const data = await response.json();
          setStores(data);
      } catch (error) {
          console.log(error);
      }
  };

  const loadRewards = async (storeAddress: string) => {
      setIsStoreLoading(true);
      try {
          const response = await fetch(`http://localhost:3000/api/loadRewards?wallet=${storeAddress}`,
              {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              }
          );
          const data = await response.json();
          setRewards(data);
          setIsStoreLoading(false);
      } catch (error) {
          console.log(error);
      }
  }

  const handleStoreSet = async (store: Store) => {
        setActiveStore(store);
        const trustLine = tokenBalances.find((tokenBalance) => (tokenBalance.account === store.wallet && tokenBalance.currency === store.token));
        if (trustLine) {
            setIsTrustLineSet(true);
        } else {
            setIsTrustLineSet(false);
        }
        loadRewards(store.wallet);
    }

    const handleTrustLineSet = async () => {
        if (!activeStore)
            return;

        await setUserTrustLine(address, activeStore.wallet, activeStore.domain, activeStore.token);
    }

  useEffect(() => {
      if (address) {
          loadUserData();
          loadStoreData();
      }
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
                          primary
                          label="Go Back"
                          onClick={() => setShowWalletSettings(false)}
                      />
                      </Box>
                  </Box>
              </Layer>
          )}
          <Header
              direction="row-responsive"
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
                      isLoadingUserData ? (
                            <Box fill align="center" pad={{ vertical: "18%" }}>
                                <Spinner size="large" />
                            </Box>
                        ) : (
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
                                              secondary={showTab === 'dashboard'}
                                              plain={showTab !== 'dashboard'}
                                          />
                                          <Button
                                              onClick={() => setShowTab('rewards')}
                                              label="Rewards"
                                              secondary={showTab === 'rewards'}
                                              plain={showTab !== 'rewards'}
                                          />                      
                                      </Box>
                                  </Box>
                                  {
                                      showTab === 'dashboard' && (
                                          <Box width="85%" direction="row-responsive">
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
                                                  <Box border round="small" pad="medium" margin="small">
                                                      <DataTable
                                                          size="medium"
                                                          columns={[
                                                          {
                                                              property: 'from',
                                                              header: <Text>From</Text>,
                                                              primary: true,
                                                              render: (datum: any) => (
                                                                <Box pad={{ vertical: 'xsmall' }}>
                                                                    {
                                                                        datum.from === "You" ?
                                                                            <Text weight="bold" color="textColor">You</Text>
                                                                            :
                                                                            <Text 
                                                                                tip={{ 
                                                                                    content: datum.from,
                                                                                    dropProps: { align: { top: 'bottom' } },
                                                                                    plain: true 
                                                                                }}>
                                                                                {datum.from.slice(0, 6) + '...' + datum.from.slice(-4)}
                                                                            </Text> 
                                                                    }
                                                                </Box>
                                                            ),

                                                          },
                                                          {
                                                              property: 'to',
                                                              header: <Text>To</Text>,
                                                              render: (datum: any) => (
                                                                <Box pad={{ vertical: 'xsmall' }}>
                                                                    {
                                                                        datum.to === "You" ?
                                                                            <Text weight="bold" color="textColor">You</Text>
                                                                            :
                                                                            <Text 
                                                                                tip={{ 
                                                                                    content: datum.to,
                                                                                    dropProps: { align: { top: 'bottom' } },
                                                                                    plain: true 
                                                                                }}>
                                                                                {datum.to.slice(0, 6) + '...' + datum.to.slice(-4)}
                                                                            </Text> 
                                                                    }
                                                                </Box>
                                                            ),
                                                          },
                                                          {
                                                              property: 'currency',
                                                              header: <Text>Currency</Text>,
                                                              render: (datum: any) => (
                                                                <Box pad={{ vertical: 'xsmall' }}>
                                                                    <Text weight="bold">{datum.currency}</Text>
                                                                </Box>
                                                            ),
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
                                                          <Heading level="3">Tokens</Heading>
                                                          <DataTable
                                                              columns={[
                                                              {
                                                                  property: 'currency',
                                                                  header: <Text>Currency</Text>,
                                                                  primary: true,
                                                              },
                                                              {
                                                                  property: 'balance',
                                                                  header: <Text>Balance</Text>,
                                                              },
                                                              ]}
                                                              data={tokenBalances}
                                                          />
                                                      </Box>
                                                  </Box>
                                              </Box>            
                                          </Box>
                                      )
                                  }
                                  {
                                      showTab === 'rewards' && (
                                          <Box width="85%">
                                            { isStoreLoading ? (
                                                <Box fill align="center" pad={{ vertical: "18%" }}>
                                                    <Spinner size="large" />
                                                </Box>
                                            )
                                            : (
                                                <Box>
                                                    <Box 
                                                        pad="medium"
                                                        margin="small"
                                                        direction="row-responsive"
                                                        justify="between" 
                                                        align="center"  
                                                    >
                                                        {
                                                            activeStore ? (
                                                                <Box>
                                                                    <Heading level="3">{activeStore.name}</Heading>
                                                                    <Text>{activeStore.domain}</Text>
                                                                    <Text>{activeStore.token}</Text>
                                                                </Box>
                                                            ) : (
                                                                <Heading level="3">Stores {stores.length}</Heading>
                                                            )
                                                        }
                                                        <Text>Search</Text>
                                                        { activeStore && (
                                                            <Button
                                                                primary
                                                                label="Go Back"
                                                                onClick={() => setActiveStore(null)}
                                                            />
                                                        )}
                                                    </Box>
                                                    <Box             
                                                        direction="row-responsive"
                                                        wrap
                                                        align="center"
                                                        justify="center"
                                                        >
                                                        { !activeStore && (
                                                            stores.map((store, index) => {
                                                                return (
                                                                    <Box onClick={() => handleStoreSet(store)}>
                                                                    <Store
                                                                        key={index}
                                                                        name={store.name}
                                                                        description=""
                                                                        address={store.wallet}
                                                                        />
                                                                    </Box>
                                                                );
                                                            })
                                                            )
                                                        }
                                                            { activeStore && isTrustLineSet && (
                                                                rewards.map((reward: Reward, index) => {
                                                                    return (
                                                                    <Box>
                                                                        <Reward
                                                                            key={index}
                                                                            name={reward.name}
                                                                            points={reward.price}
                                                                            description={reward.description}
                                                                            isCustomer={true}
                                                                            shopAddress={activeStore.wallet}
                                                                            token={activeStore.token}
                                                                        />
                                                                    </Box>
                                                                    );
                                                                })
                                                            )
                                                        }
                                                        { activeStore && !isTrustLineSet && (
                                                                <Box>
                                                                    <Text>Set Trust Line</Text>
                                                                    <Button
                                                                        primary
                                                                        label="Set Trust Line"
                                                                        onClick={() => handleTrustLineSet()}
                                                                    />
                                                                </Box>
                                                            )
                                                        }
                                                    </Box>
                                                </Box>
                                            )}
                                          </Box>
                                      )
                                  }
                              </Box>
                          </Box>  
                      )                       
                  )
                  : (
                      <Box fill align="center" justify="center">
                            <Box width="medium" gap="medium" align="center" pad="xxlarge">
                                <Heading level="3">Connect your wallet</Heading>
                                { installGemWallet && (
                                    <Button 
                                        label="Install Gem Wallet"
                                        primary
                                        href="https://gemwallet.app/"
                                        target="_blank"
                                    />
                                )}
                            </Box>
                      </Box>
                  )
              }         
          </Main>
      </Box>
  );
}
