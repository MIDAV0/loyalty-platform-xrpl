import { Anchor, Avatar, Box, Heading, Layer, Meter, Stack, Text, ResponsiveContext, Button } from 'grommet';
import { useEffect, useState, useContext } from 'react';
import { Chat, CreditCard, Favorite, Group, Scorecard, UserFemale, View, Image } from 'grommet-icons';
import { PrimaryButton } from './PrimaryButton';

export interface Task {
  address: string;
  name: string;
  description: string;
  input: string;
  output: string;
  modelName: string;
  taskType: string;
  sizeMemory: number;
  outputDescription: string;
  minParticipants: number;
  maxParticipants: number;
  rounds: number;
  accuracy: number;
  stake: number;
  rewardPool: number;
  modelDefinitionHash: string;
  schema: string;
  sampleData: any;
  sampleDataContent: string;
  numberOfParticipants: number;
}

type CardColors = {
  [key: string]: TaskCardProps;
}

interface TaskCardProps {
  cardColor: string;
  cardIcon: JSX.Element;
}

const cardColors: CardColors = {
  "Large Language Model Finetuning": {
    cardColor: "#A4C0FF", cardIcon: <Chat color="black" size="20px" />
  },
  "NLP": {
    cardColor: "#E69FBD", cardIcon: <Scorecard color="black" size="20px" />
  },
  "Time series prediction": {
    cardColor: "#D9D9D9", cardIcon: <CreditCard color="black" size="20px" />
  },
  "Classification": {
    cardColor: "#BDD4DA", cardIcon: <Image color="black" size="20px" />
  },
}

export const Tasks = ({
  setNumberOfTasks,
  filterItems,
}: {
  setNumberOfTasks: (numberOfTasks: number) => void;
  filterItems: string[];
}) => {
  const [tasks, setTasks] = useState<Task[]>([] as Task[]);
  const [showTask, setShowTask] = useState(false);

  const [taskToShow, setTaskToShow] = useState<Task>({} as Task);

  const ipfsGatewayURL = `https://gateway.ipfs.io/ipfs/${taskToShow.sampleData}`;


  return (
    <>
      <Box
        direction="row-responsive"
        wrap
        width="100%"
        align="center"
        justify="center"
        gap="small"
      >
        {tasks
          ?.filter((task) => filterItems.length === 0 || filterItems.includes(task.taskType))
          .map((task: Task, index: number) => {
          return (
            <Box
              background="#FFFFFF"
              key={index}
              align="start"
              justify="center"
              round="small"
              elevation="large"
              pad="medium"
              margin={{ top: 'small' }}
              height={{ min: 'small' }}
              width="400px"
              border={{ color: 'black', size: 'small' }}
            >
              <Heading level="3" margin="none">
                  {task.name}
              </Heading>
              <Text>{task.description}</Text>
              <Text margin={{ top: 'xsmall', bottom: 'xsmall' }} size="small">Updated 0 days ago</Text>
              <Box 
                  direction="row" 
                  width="100%" 
                  justify="between" 
                  align="center" 
                  pad={{ bottom: 'xsmall' }}
                  >
                  <Box
                      border={{ color: 'black', size: 'small' }}
                      round="small"
                      pad="xsmall"
                      background={cardColors[task.taskType]?.cardColor}
                      direction="row"
                      gap="small"
                      align="center"
                      width={{ max: '70%'}}
                  >
                      {cardColors[task.taskType]?.cardIcon}<Text weight="bold" truncate={true}>{task.taskType === "Large Language Model Finetuning" ? "LLM Finetuning" : task.taskType}</Text>
                  </Box>
                  <Box direction="row" gap="small">
                      <Box direction="row" gap="1px"><Favorite color="black" /> {}</Box>
                      <Box direction="row" gap="1px"><View color="black" /> {}</Box>
                      <Box direction="row" gap="1px"><Group color="black" /> {}</Box>
                  </Box>
              </Box>
              <Box
                direction="row"
                justify="between"
                border={{
                  color: 'black',
                  size: 'small',
                  style: 'solid',
                  side: 'bottom'
                }}
                pad={{ bottom: 'xsmall' }}
              >
                <Box
                  direction="row" 
                  align="center" 
                  gap="xsmall"
                >
                  <Heading level="3" margin="0">
                    {(
                      ((task.rewardPool / task.rounds) * 100) /
                      task.rewardPool
                    ).toFixed(2)}
                    %
                  </Heading>
                  <Box basis="1/2">
                    <Text size="small">Rewards Return Rate</Text>
                  </Box>
                </Box>
                <Box 
                  direction="row" 
                  align="center"
                  gap="xsmall"
                  justify="end"
                  margin={{ left: 'small'}}
                  basis='1/2'
                >
                  <Heading level="3" color="#6C94EC" margin="0">
                    {task.minParticipants}
                  </Heading>
                  <Box width="xsmall">
                    <Text size="small" color="#6C94EC">Participants Requirements</Text>
                  </Box>
                </Box>
              </Box>
              <Box direction="row" width="100%" justify="between" margin={{ top: 'small'}}>
                <Box direction="row" gap="small" alignSelf="end">
                      <UserFemale color='brand' />
                      <Text>Creator Name</Text>
                </Box>
                <Box align="center">
                  <Box
                    direction="row"
                    gap="xxsmall"
                    align="center"
                  >
                    <Text size="small" weight="bold">Short of</Text>
                    <Text size="medium" color="#6C94EC" weight="bold">
                      {task.minParticipants - Number(task.numberOfParticipants)}
                    </Text>
                    <Text size="small" weight="bold">to start</Text>
                  </Box>
                  <PrimaryButton
                    onClick={() => {
                      setTaskToShow(task);
                      setShowTask(true);
                    }}
                    label="Join"
                    size="medium"
                    alignSelf="end"
                    pad={{ vertical: 'xsmall', horizontal: 'medium' }}
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
