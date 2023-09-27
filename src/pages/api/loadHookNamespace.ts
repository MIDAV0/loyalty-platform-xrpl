import type { NextApiRequest, NextApiResponse } from 'next';
import { hexNamespace } from '@transia/hooks-toolkit'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {


  try {
    const hookNameHex = hexNamespace("wormXRPL");

    res.status(200).json(hookNameHex);
  } catch (error) {
    console.error(error);
    res.status(500).json("None");
  }
}
