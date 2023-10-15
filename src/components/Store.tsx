import { Text, Button, Card, CardBody, CardFooter, CardHeader, Image, Box, Heading } from 'grommet';
import { Favorite, ShareOption } from 'grommet-icons';

interface StoreProps {
    name: string;
    description: string;
    address: string;
}

export const Store = (props: StoreProps) => {
    
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
                <Text>
                    {props.address.slice(0, 6) + "..." + props.address.slice(-6)}
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