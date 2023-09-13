import { ReactNode, createContext, useMemo } from 'react';

interface WalletContextProviderProps {
  children: ReactNode;
}

interface IWalletContext {
  data: any;
}

export const WalletContext = createContext<IWalletContext>(
  {} as IWalletContext
);

export function WalletContextProvider({
  children,
}: WalletContextProviderProps) {
  // const { data: nativeTokenBalance } = useBalance({
  //   address: address as `0x${string}`,
  //   watch: true,
  // });

  // const { data: flockTokenBalance } = useBalance({
  //   address: address as `0x${string}`,
  //   token: process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS as `0x${string}`,
  //   watch: true,
  // });

  let data = 10

  const value = useMemo(
    () => ({
      data,
    }),
    [data]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
