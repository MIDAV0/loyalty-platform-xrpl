import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {


  try {
    const { wallet } = req.query;

    const storeData = await prisma.store.findMany({
        where: {
            wallet: wallet as string,
        }
    });
    
    if (storeData[0]) {
        res.status(200).json(true);
        return;
    }

    const store = await prisma.store.create({
        data: {
            wallet: wallet as string,
        }
    });

    res.status(200).json(true);
  } catch (error) {
    console.error(error);
    res.status(500).json(false);
  }
}
