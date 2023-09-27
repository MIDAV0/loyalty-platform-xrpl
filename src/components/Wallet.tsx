import { Box, Button, Heading, Layer, Text } from 'grommet';
import { useContext, useState, useEffect } from 'react';
import { WalletContext } from '../context/walletContext';
import { isInstalled, getAddress } from '@gemwallet/api'
import { toast } from 'react-toastify';
import { dropsToXrp, AccountTxTransaction} from 'xrpl';
import getWalletDetails from '../helpers/getWalletDetails';

interface AccountData {
  balance: string;
  transactions?: AccountTxTransaction[];
};

export function Wallet() {
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);


  const connectWallet = async () => {
    const installed = await isInstalled();
    if (installed) {
      getAddress().then((response) => {
        response.result ? setAddress(response.result.address) : setAddress('');
      });
      setIsConnected(true);
    }
  }

  const loadUserData = async () => {
    const { balance, transactions }: AccountData = await getWalletDetails(address);
    console.log(transactions);
    setBalance(
      Number(dropsToXrp(balance)).toFixed(2)
    );
  };

  useEffect(() => {
    if (address)
      loadUserData();
  }, [address])

  if (showWalletSettings) {
    return (
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
    );
  }

  return (
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
  );
}

export default Wallet;
