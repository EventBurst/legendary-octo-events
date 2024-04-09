import Attendee from "../models/attendee.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// get all attendees
const getAllAttendees = asyncHandler(async (req, res) => {
  const attendees = await Attendee.find();
  if (!attendees) throw new ApiError(404, "Attendee not found");
  return res
    .status(200)
    .json(new ApiResponse(200, attendees, "Attendees found"));
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
    "-password -refreshToken",
  );
  if (!createdAttendee) throw new ApiError(500, "Attendee creation failed");
  return res
    .status(201)
    .json(new ApiResponse(201, attendee, "Attendee registered"));
});

//generate access and refresh token
const generateAccessAndRefreshToken = async (attendee) => {
  try {
    const refreshToken = attendee.generateRefreshToken();
    const accessToken = attendee.generateAccessToken();
    attendee.refreshToken = refreshToken;
    await attendee.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something Went Wrong While Generating Token");
  }
};

// login Attendee
const loginAttendee = asyncHandler(async (req, res) => {
  //get Attendee details from frontend
  const { email, password } = req.body;

  //validation-not empty
  if ([email, password].some((value) => value.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }

  //check if Attendee exists :email
  const attendee = await Attendee.findOne({ email: email });
  if (!attendee) {
    throw new ApiError(404, "Attendee with email not found");
  }

  //check if password is correct
  const isPasswordCorrect = await attendee.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credentials");
  }

  //generate access and refresh token
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(attendee);

  // remove password and refresh token field from response
  const loggedInAttendee = await Attendee.findById(attendee._id).select(
    "-password -refreshToken",
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { loggedInAttendee, accessToken, refreshToken },
        "Attendee Logged In Successfully",
      ),
    );
});
// refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  //get refresh token from attendee
  const incomingRefershToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefershToken) throw new ApiError(401, "Unauthorized request");
  // decode  token
  const decoded = jwt.verify(
    incomingRefershToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  const attendee = await Attendee.findById(decoded?._id);
  if (!attendee) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
  // verify token with the token stored in the attendee db
  if (attendee.refreshToken !== incomingRefershToken) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
  // if valid, generateAccessAndRefreshToken
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(attendee);
  // send cookies response to the attendee
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access Token Refreshed Successfully",
      ),
    );
});

export { getAllAttendees, registerAttendee, loginAttendee, refreshAccessToken };
