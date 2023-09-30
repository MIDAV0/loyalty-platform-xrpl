import { Text, Button, Card, CardBody, CardFooter, CardHeader, Image, Box } from 'grommet';
import { Favorite, ShareOption } from 'grommet-icons';

interface RewardProps {
    name: string;
    points: number;
}

export const Reward = (props: RewardProps) => {
    
    return (
        <Box flex={false} margin="small">
        <Card height="medium" width="medium" background="light-1">
            <CardHeader pad="medium">{props.name}</CardHeader>
            <CardBody pad="medium">
                <Image
                    fit="cover"
                    src="coffeeImage.png"
                    alt="reward image"
                />
            </CardBody>
            <CardFooter pad={{horizontal: "small"}} background="light-2">
                <Button
                    primary
                    label="Redeem"
                    hoverIndicator
                />
                <Text>
                    {props.points}
                </Text>
            </CardFooter>
        </Card>
        </Box>
    )
};

{/* <Box
background="#FFFFFF"
key={props.index}
align="start"
justify="center"
round="small"
elevation="large"
pad="medium"
margin={{ top: 'small' }}
height={{ min: 'small' }}
width="350px"
border={{ color: 'black', size: 'small' }}
>
<Box>
    Data
</Box>
</Box> */}