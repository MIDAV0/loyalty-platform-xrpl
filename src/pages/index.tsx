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
            Platform title
          </Heading>
          <Text size="xxlarge" textAlign="center" color="black">
            Continue to the platform as
          </Text>
        </Box>
        <Box direction="row-responsive" gap="xlarge">
          <SecondaryButton
            href="/business"
            margin={{ top: 'large' }}
            label="Business"
            size="xlarge"
            pad={{ vertical: 'medium', horizontal: 'xlarge' }}
          />
          <PrimaryButton
            href="/customer"
            margin={{ top: 'large' }}
            label="Customer"
            size="xlarge"
            pad={{ vertical: 'medium', horizontal: 'xlarge' }}
          />
        </Box>
      </Box>
    </Layout>
  );
}
