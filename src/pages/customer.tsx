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
  InfiniteScroll,
  Data,
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

const dates = [{ date: '2020-08-20', amount: 2 }, { date: '2020-08-21', amount: 47 }, { date: '2020-08-22', amount: 33 }];

interface AccountData {
  balance: string;
  transactions?: AccountTxTransaction[];
  isHookSet?: boolean;
  tokenBalances?: AccountLinesTrustline[];
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
      console.log(transactions);
      
      setTokenBalances(tokenBalances);

      const filteredTxns = transactions ? transactions?.filter((transaction) => transaction.tx?.TransactionType === 'Payment') : [];

      const filteredTxnsData = filteredTxns?.map((txn) => {
          return {
              from: txn.tx?.Account === address ? 'You' : txn.tx?.Account,
              to: txn.tx?.Destination ? (txn.tx?.Destination === address ? 'You' : txn.tx?.Destination) : '',
              currency: txn.tx?.Amount.currency ? txn.tx?.Amount.currency : 'XRP',
              amount: dropsToXrp(txn.tx?.Amount.value ? txn.tx?.Amount.value : txn.tx?.Amount), 
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
                                          />
                                          <Button
                                              onClick={() => setShowTab('rewards')}
                                              label="Rewards"
                                              primary={showTab === 'rewards'}
                                              plain={showTab !== 'rewards'}
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
                                              <Box 
                                                  pad="medium"
                                                  margin="small"
                                                  direction="row-responsive"
                                                  justify="between"    
                                              >
                                                  <Text>Rewards {rewards.length}</Text>
                                                  <Text>Search</Text>
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
