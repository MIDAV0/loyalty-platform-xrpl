import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Reward = {
    name: string;
    description: string;
    price: number;
    storeWallet: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reward[]>
) {


  try {
    const { wallet } = req.query;

    const rewardData = await prisma.reward.findMany({
        where: {
            storeWallet: wallet as string,
        }
    });

    const rewards = rewardData.map(reward => {
        return {
            name: reward.name,
            description: reward.description,
            price: reward.price,
            storeWallet: reward.storeWallet,
        }
    });

    res.status(200).json(rewards);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
}
