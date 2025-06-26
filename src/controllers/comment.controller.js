import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Get all comments for a video (with pagination)
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new Apierror(400, "Invalid video ID");
  }

  const comments = await Comment.find({ video: videoId })
    .populate("user", "username")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Comment.countDocuments({ video: videoId });

  res.status(200).json(new Apiresponse(200, {
    comments,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    totalResults: total
  }));
});

// ✅ Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new Apierror(400, "Invalid video ID");
  }

  if (!text?.trim()) {
    throw new Apierror(400, "Comment text is required");
  }

  const comment = await Comment.create({
    video: videoId,
    user: req.user._id,
    text
  });

  const populatedComment = await comment.populate("user", "username");

  res.status(201).json(new Apiresponse(201, populatedComment, "Comment added"));
});

// ✅ Update a comment (only by the user who made it)
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Apierror(400, "Invalid comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Apierror(404, "Comment not found");

  if (!comment.user.equals(req.user._id)) {
    throw new Apierror(403, "You can only update your own comments");
  }

  comment.text = text || comment.text;
  await comment.save();

  res.status(200).json(new Apiresponse(200, comment, "Comment updated"));
});

// ✅ Delete a comment (only by the user who made it)
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Apierror(400, "Invalid comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) throw new Apierror(404, "Comment not found");

  if (!comment.user.equals(req.user._id)) {
    throw new Apierror(403, "You can only delete your own comments");
  }

  await comment.deleteOne();

  res.status(200).json(new Apiresponse(200, {}, "Comment deleted"));
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
};
