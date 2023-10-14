import { type AppType } from 'next/app';

import { Box, Grommet } from 'grommet';
import './global.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


const xrpl = {
  global: {
    font: {
      family: 'Audiowide',
    },
    focus: {
      border: {
        color: 'transparent',
      },
    },
    colors: {
      brand: '#E07A5F',
      secondary: '#3D405B',
      textColor: '#81B29A'
    },
  },
  button: {
    default: {
      background: { color: '#E07A5F' },
      border: { color: '#000000' },
    },
    color: '#FFFFFF',
    border: { width: '2px', radius: '8px', color: '#000000' },
    primary: {
      border: { width: '2px', radius: '8px', color: '#000000' },
      font: { weight: 'bold' },
      color: '#FFFFFF',
      background: {
        color: '#E07A5F',
      },
    },
    secondary: {
      border: { width: '2px', radius: '8px', color: '#000000' },
      font: { weight: 'bold' },
      color: '#FFFFFF',
      background: {
        color: '#3D405B',
      },
    },
  },
  formField: { label: { requiredIndicator: true } },
};

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <Grommet theme={xrpl}>
      <Box height="100vh" background="#F4F1DE">
        <Component {...pageProps} />
        <ToastContainer />
      </Box>
    </Grommet>
  );
};

export default MyApp;
