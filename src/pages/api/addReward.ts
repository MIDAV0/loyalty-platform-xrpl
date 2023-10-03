import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {


  try {
    const { name, description, price, wallet } = req.body;

    const createReward = await prisma.reward.create({
        data: {
            name,
            description,
            price,
            storeWallet: wallet,
        }
    });
    res.status(200).json(true);
  } catch (error) {
    console.error(error);
    res.status(500).json(false);
  }
}
