// Require Mongoose
import { Schema, model } from "mongoose";

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
});

// Create the Attendee model
const Attendee = model("Attendee", AttendeeSchema);

// Export the Attendee model
export default Attendee;
