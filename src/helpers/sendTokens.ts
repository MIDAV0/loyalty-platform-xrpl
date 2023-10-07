import { sendPayment } from '@gemwallet/api';


export default async function sendTokens(issuerAddress: string, token: string, amount: string) {
    try {
        const payload = {
            amount: {
                currency: token,
                value: amount,
                issuer: issuerAddress,
            },
            destination: issuerAddress,
          };
          
        sendPayment(payload).then((response) => {
            console.log(response.result?.hash);
        }).catch((error) => {
            console.error("Transactions submission failed", error);
        });

    } catch (error) {
        console.log('Error sending tokens', error);
    }
}