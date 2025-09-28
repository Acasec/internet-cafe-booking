import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  pcNumber: number;           // 1..20
  startTime: Date;
  endTime?: Date | null;      // open-ended
}

const BookingSchema = new Schema<IBooking>({
  customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  pcNumber: { type: Number, required: true, min: 1, max: 20 },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: null },
});

export default (mongoose.models.Booking as mongoose.Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);
