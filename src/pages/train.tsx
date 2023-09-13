import {
  Box,
  Button,
  Heading,
  Layer,
  Menu,
  Paragraph,
  TextInput,
  Text,
  ResponsiveContext,
} from 'grommet';
import { Layout, PrimaryButton, Tasks } from '../components';
import { Chat, CreditCard, Scorecard, Search, Image } from 'grommet-icons';

export default function TrainPage() {

  return (
    <Layout>
      <Box direction="row-responsive" width="100%">
        <Text>
          Train
        </Text>
      </Box>
    </Layout>
  );
}
