import { Box, Heading, Text } from 'grommet';
import { Layout, PrimaryButton, SecondaryButton } from '../components';

export default function IndexPage() {
  return (
    <Layout>
      <Box
        align="center"
        justify="center"
        alignSelf="center"
        gap="xlarge"
        height="100vh"
      >
        <Box>
          <Heading size="large" color="black" textAlign="center">
            The On-Chain Decentralized Machine Learning Platform
          </Heading>
          <Text size="xxlarge" textAlign="center" color="black">
            <b>F</b>ederated <b>L</b>earning on Bl<b>ock</b>chain{' '}
          </Text>
        </Box>
        <Box direction="row-responsive" gap="xlarge">
          <SecondaryButton
            margin={{ top: 'large' }}
            label="Download App"
            size="xlarge"
            pad={{ vertical: 'medium', horizontal: 'xlarge' }}
            href="https://github.com/FLock-io/client-interface/releases"
            target="_blank"
          />
          <PrimaryButton
            href="/train"
            margin={{ top: 'large' }}
            label="Start Training"
            size="xlarge"
            pad={{ vertical: 'medium', horizontal: 'xlarge' }}
          />
        </Box>
      </Box>
    </Layout>
  );
}
