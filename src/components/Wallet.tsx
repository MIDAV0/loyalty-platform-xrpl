import { Box, Button, Heading, Layer, Text } from 'grommet';
import { useContext, useState } from 'react';
import { WalletContext } from '../context/walletContext';

export function Wallet() {
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const { data } = useContext(WalletContext);

  if (showWalletSettings) {
    return (
      <Layer onEsc={() => setShowWalletSettings(false)}>
        <Box align="center" justify="center" pad="large" gap="medium">
          <Heading level="3">Wallet Settings</Heading>
          <Box align="start" gap="xsmall">
            <Text>
              <b>Wallet Address:</b> awfaokfaof
            </Text>
            <Text>
              <b>FLock(FLC) Balance: </b>
              {data ? data.formatted : 0} $F
            </Text>
          </Box>
          <Box direction="row" alignSelf="end" gap="small">
            <Button
              secondary
              label="Go Back"
              onClick={() => setShowWalletSettings(false)}
            />
            <Button
              primary
              label="Disconnect"
              onClick={() => {
                setShowWalletSettings(false);
              }}
            />
          </Box>
        </Box>
      </Layer>
    );
  }

  return (
    <Button
      primary
      label="Connect Wallet"
      pad="xsmall"
      onClick={
        true
          ? () => {
              setShowWalletSettings(true);
            }
          : () => {
              
            }
      }
    />
  );
}

export default Wallet;
