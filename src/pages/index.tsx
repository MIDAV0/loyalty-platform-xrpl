import { Box, Heading, Text } from 'grommet';
import { Down } from "grommet-icons";
import { Layout, PrimaryButton, SecondaryButton } from '../components';

export default function IndexPage() {
  return (
    <Layout>
      <Box
        align="center"
        gap="large"
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
      <Box align="center">
        <Heading>How it works</Heading>
        <Box width="100%" direction="row-responsive" pad={{ bottom: "large"}}>
          <Box basis='1/2' align="center" border={{side: "right"}} gap="medium">
            <Heading level="3">Business</Heading>
            <Text>Set up account</Text>
            <Down />
            <Text>Create rewards</Text>
            <Down />
            <Text>Spoil your customers</Text>
          </Box>
          <Box basis='1/2' align="center" gap="medium">
            <Heading level="3">Customer</Heading>
            <Text>Browse available stores</Text>
            <Down />
            <Text>Choose store and set up trust line</Text>
            <Down />
            <Text>Enjoy rewards</Text>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
