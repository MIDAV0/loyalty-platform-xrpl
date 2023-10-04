import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Store {
  id: string;
  wallet: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Store | undefined>
) {

  try {
    const { wallet } = req.query;

    const storeData = await prisma.store.findMany({
        where: {
            wallet: wallet as string,
        }
    });
    
    if (!storeData[0]) {
        res.status(400).json(undefined);
        return;
    }
    
    res.status(200).json(storeData[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json(undefined);
  }
}
