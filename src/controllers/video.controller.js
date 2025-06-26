import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { uploadOncloudinary } from "../utils/cloudinary.js";

// GET ALL VIDEOS c
const getAllVideos = asyncHandler(async (req, res) => { 
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

  const filter = {};
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    filter.owner = userId;
  }

  const sort = { [sortBy]: sortType === "asc" ? 1 : -1 };

  const videos = await Video.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("owner", "username");

  const total = await Video.countDocuments(filter);

  res.status(200).json(new Apiresponse(200, {
    results: videos,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    totalResults: total
  }));
});

// PUBLISH A VIDEO
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new Apierror(400, "Title and description are required");
  }

  const videoLocalPath = req.files?.video?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new Apierror(400, "Video and thumbnail are required");
  }

  const videoUpload = await uploadOnCloudinary(videoLocalPath, "video");
  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath, "image");

  const video = await Video.create({
    title,
    description,
    videoFile: {
      public_id: videoUpload.public_id,
      url: videoUpload.secure_url,
    },
    thumbnail: {
      public_id: thumbnailUpload.public_id,
      url: thumbnailUpload.secure_url,
    },
    owner: req.user._id,
    published: true,
  });

  res.status(201).json(new Apiresponse(201, video));
});

// GET VIDEO BY ID
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new Apierror(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("owner", "username email");

  if (!video) {
    throw new Apierror(404, "Video not found");
  }

  res.status(200).json(new Apiresponse(200, video));
});

// UPDATE VIDEO
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new Apierror(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new Apierror(404, "Video not found");
  }

  if (title) video.title = title;
  if (description) video.description = description;

  if (req.files?.thumbnail?.[0]) {
    const newThumb = await uploadOnCloudinary(req.files.thumbnail[0].path, "image");
    video.thumbnail = {
      public_id: newThumb.public_id,
      url: newThumb.secure_url,
    };
  }

  await video.save();

  res.status(200).json(new Apiresponse(200, video, "Video updated successfully"));
});

// DELETE VIDEO
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new Apierror(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndDelete(videoId);

  if (!video) {
    throw new Apierror(404, "Video not found or already deleted");
  }

  res.status(200).json(new Apiresponse(200, {}, "Video deleted successfully"));
});

// TOGGLE PUBLISH STATUS
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new Apierror(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new Apierror(404, "Video not found");
  }

  video.published = !video.published;
  await video.save();

  res.status(200).json(new Apiresponse(200, video, `Video ${video.published ? 'published' : 'unpublished'}`));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
};
