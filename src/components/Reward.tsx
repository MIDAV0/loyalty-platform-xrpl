import { Text, Button, Card, CardBody, CardFooter, CardHeader, Image, Box } from 'grommet';
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
            <CardHeader pad="medium">{props.name}</CardHeader>
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
            <CardFooter pad={{horizontal: "small"}} background="light-2">
                {   props.isCustomer &&
                    <Button
                        primary
                        label="Redeem"
                        hoverIndicator
                        onClick={handlePurchase}
                    />
                }
                <Text alignSelf="end">
                    {props.points}
                </Text>
            </CardFooter>
        </Card>
    )
};