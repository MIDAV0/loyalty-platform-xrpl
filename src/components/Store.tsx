import { Text, Button, Card, CardBody, CardFooter, CardHeader, Image, Box } from 'grommet';
import { Favorite, ShareOption } from 'grommet-icons';

interface StoreProps {
    name: string;
    description: string;
    address: string;
}

export const Store = (props: StoreProps) => {
    
    return (
        <Card margin="small" flex={false} height="medium" width="medium" background="light-1">
            <CardHeader pad="medium">{props.name}</CardHeader>
            <CardBody pad="medium">
                <Text>
                    {props.description}
                </Text>
                <Text>
                    {props.address}
                </Text>
                <Image
                    fit="cover"
                    src="coffeeImage.png"
                    alt="reward image"
                />
            </CardBody>
        </Card>
    )
};