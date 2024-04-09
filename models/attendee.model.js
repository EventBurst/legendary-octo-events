// Require Mongoose
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Define the Attendee schema
const AttendeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  },
});
AttendeeSchema.pre("save", async function (next) {
  // Hash the password before saving the Attende model only when the password is modified or new
if (this.isModified("password")) {
  this.password = await bcrypt.hash(this.password, 10);
}
next();
});
AttendeeSchema.methods.isPasswordCorrect = async function (password) {
return await bcrypt.compare(password, this.password);
};

// Export the Attendee model
export default Attendee;
