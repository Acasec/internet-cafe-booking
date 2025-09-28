import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../../lib/mongodb";
import Booking from "../../../models/Booking";
import Customer from "../../../models/Customer";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method === "GET") {
    const bookings = await (Booking as any).find({}).populate("customer");
    const active = await (Booking as any).find({ endTime: null }).select("pcNumber");
    const occupied = Array.from(new Set(active.map((b: any) => b.pcNumber)));
    return res.status(200).json({ bookings, occupied });
  }

  if (req.method === "POST") {
    const { customerId, pcNumber } = req.body || {};
    if (!customerId || !pcNumber) {
      return res.status(400).json({ error: "Missing customerId or pcNumber" });
    }

    const booking = await (Booking as any).create({
      customer: customerId,
      pcNumber,
      startTime: new Date(),
      endTime: null,
    });

    return res.status(201).json(booking);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Booking ID required" });

    const booking = await (Booking as any).findById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Mark booking as ended
    booking.endTime = new Date();
    await booking.save();

    return res.status(200).json({ message: "Booking ended", booking });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
