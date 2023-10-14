import { Box, Heading, Text } from 'grommet';
import { Down } from "grommet-icons";
import { Layout, PrimaryButton, SecondaryButton } from '../components';

export default function IndexPage() {
  return (
    <Layout>
      <Box
        align="center"
        gap="large"
        height="100vh"
      >
        <Box margin={{top: "xlarge"}}>
          <Heading size="large" color="black" textAlign="center">
            Loyalty programs on the XRPL
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
        <Box align="center" margin={{ top: "large" }}>
          <Text size="large">Learn more</Text>
          <Down size="large" />
        </Box>
      </Box>
    </Layout>
  );
}
