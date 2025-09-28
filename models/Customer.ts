import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email?: string;
  phone?: string;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: String,
  phone: String,
});

export default (mongoose.models.Customer as mongoose.Model<ICustomer>) ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
