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

// register an attendee
const registerAttendee = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, address, password } = req.body;
  if (!name || !email || !phoneNumber || !address || !password) {
    throw new ApiError(400, "All fields are required");
  }
  // check if the email is already registered
  const attendeeExists = await Attendee.findOne({ email });
  if (attendeeExists) throw new ApiError(400, "Email already registered");
  
  // create a new attendee
  const attendee = await Attendee.create({
    name,
    email,
    phoneNumber,
    address,
    password,
  });

  const createdAttendee = await Attendee.findById(attendee._id).select(
    "-password -refreshToken"
  );
  if (!createdAttendee) throw new ApiError(500, "Attendee creation failed");
  return res.status(201).json(new ApiResponse(201, attendee, "Attendee registered"));
});


export { getAllAttendees };