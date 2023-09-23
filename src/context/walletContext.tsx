import { ReactNode, createContext, useMemo } from 'react';
import { Client } from 'xrpl';

interface WalletContextProviderProps {
  children: ReactNode;
}

interface IWalletContext {
  client: Client;
}

export const WalletContext = createContext<IWalletContext>(
  {} as IWalletContext
);

export function WalletContextProvider({
  children,
}: WalletContextProviderProps) {

  const client = new Client("wss://s.altnet.rippletest.net:51233/");


  let data = 10

  const value = useMemo(
    () => ({
      
      client,
    }),
    [client]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
