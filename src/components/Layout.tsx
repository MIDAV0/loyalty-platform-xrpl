import { Box, Header, Main, ResponsiveContext } from 'grommet';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Wallet } from './Wallet';


interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { push, pathname } = useRouter();
  const size = useContext(ResponsiveContext);

  return (
    <Box background="#F8FAFB">
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

        { pathname !== '/' && <Wallet /> }
      </Header>

      <Main background={pathname === '/' ? 'url(main-bg.png)' : ''} fill>
        <Box fill>{children}</Box>
      </Main>
    </Box>
  );
};
