import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../../lib/mongodb";
import Booking from "../../../models/Booking";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    const { id } = req.query;

    if (req.method === "DELETE") {
      if (!id) return res.status(400).json({ error: "Booking ID required" });

      const booking = await (Booking as any).findById(id);
      if (!booking) return res.status(404).json({ error: "Booking not found" });

      // mark booking ended
      booking.endTime = new Date();
      await booking.save();

      return res.status(200).json({ message: "Booking ended", booking });
    }

    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    console.error("BOOKINGS_ID_API_ERROR:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
