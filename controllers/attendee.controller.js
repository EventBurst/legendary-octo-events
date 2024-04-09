import { Attendee } from "../models/attendee.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


// get all attendees
const getAllAttendees = asyncHandler(async (req, res) => {
  const attendees = await Attendee.find();
  if (!attendees) throw new ApiError(404, "Attendee not found");
  return res.status(200).json(new ApiResponse(200, attendees, "Attendees found"));
});



export { getAllAttendees };