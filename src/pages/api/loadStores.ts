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
  res: NextApiResponse<Store[]>
) {

  try {
    const { wallet } = req.query;

    const storeData = await prisma.store.findMany();
    
    res.status(200).json(storeData);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
}
