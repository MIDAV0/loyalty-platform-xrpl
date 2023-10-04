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
        const { wallet, name } = req.body;

        if (!wallet || !name) {
            res.status(400).json(undefined);
            return;
        }

        const store = await prisma.store.create({
            data: {
                wallet: wallet as string,
                name: name as string,
            }
        });

        res.status(200).json(store);
    } catch (error) {
        console.error(error);
        res.status(500).json(undefined);
    }
}