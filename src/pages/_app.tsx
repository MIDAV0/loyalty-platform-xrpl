import { type AppType } from 'next/app';

import { Grommet } from 'grommet';
import './global.css';
import { WalletContextProvider } from '../context/walletContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


const xrpl = {
  global: {
    font: {
      family: 'Gilroy',
    },
    focus: {
      border: {
        color: 'transparent',
      },
    },
    colors: {
      brand: '#6C94EC',
    },
  },
  button: {
    default: {
      background: { color: '#6C94EC' },
      border: { color: '#000000' },
    },
    color: '#FFFFFF',
    border: { width: '2px', radius: '8px', color: '#000000' },
    primary: {
      border: { width: '2px', radius: '8px', color: '#000000' },
      font: { weight: 'bold' },
      color: '#FFFFFF',
      background: {
        color: '#6C94EC',
      },
    },
    secondary: {
      border: { width: '2px', radius: '8px', color: '#000000' },
      font: { weight: 'bold' },
      color: '#000000',
      background: {
        color: '#EEEEEE',
      },
    },
  },
  formField: { label: { requiredIndicator: true } },
};

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <Grommet theme={xrpl}>
        <WalletContextProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </WalletContextProvider>
    </Grommet>
  );
};

export default MyApp;
