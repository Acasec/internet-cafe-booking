import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../lib/mongodb";
import Customer from "../../models/Customer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "GET") {
    const customers = await (Customer as any).find({});
    return res.status(200).json(customers);
  }

  if (req.method === "POST") {
    const { name, email, phone } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const created = await (Customer as any).create({ name, email, phone });
    return res.status(201).json(created);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
