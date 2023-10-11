import { Text, Button, Card, CardBody, CardFooter, CardHeader, Image, Box, Heading } from 'grommet';
import sendTokens from '../helpers/sendTokens';

interface RewardProps {
    name: string;
    description: string;
    points: number;
    isCustomer: boolean;
    shopAddress?: string;
    token?: string;
}

export const Reward = (props: RewardProps) => {
    const handlePurchase = () => {
        if (props.shopAddress && props.token)
            sendTokens(props.shopAddress, props.token, props.points.toString());
    };

    return (
        <Card margin="small" flex={false} height="medium" width="medium" background="light-1">
            <CardHeader pad={{horizontal: "medium", top: "medium"}}>
                <Heading level="3" margin="none">
                    {props.name}
                </Heading>
            </CardHeader>
            <CardBody pad="medium">
                <Text>
                    {props.description}
                </Text>
                <Image
                    fit="cover"
                    src="coffeeImage.png"
                    alt="reward image"
                />
            </CardBody>
            <CardFooter pad={{horizontal: "medium", vertical: "small"}} background="light-2">
                {   props.isCustomer &&
                    <Button
                        primary
                        label="Redeem"
                        hoverIndicator
                        onClick={handlePurchase}
                    />
                }
                <Text alignSelf="end" weight="bold">
                    Price: {props.points} {props.token}
                </Text>
            </CardFooter>
        </Card>
    )
};