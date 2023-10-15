import { Box, Header, Main, ResponsiveContext } from 'grommet';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Wallet } from './Wallet';
import Image from 'next/image';


interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { push, pathname } = useRouter();
  const size = useContext(ResponsiveContext);

  return (
    <Box background="#F4F1DE">
      <Header
        direction="row"
        align="center"
        pad={{ vertical: 'small', horizontal: 'xlarge' }}
        border="bottom"
        gap="xlarge"
        background="#FFFFFF"
        height="xsmall"
      >
          <Image
            width={200}
            height={80}
            src="/Logo.png"
            alt="reward image"
          />   
      </Header>

      <Main background={pathname === '/' ? 'url(main-bg.png)' : ''} fill>
        <Box fill>{children}</Box>
      </Main>
    </Box>
  );
};
