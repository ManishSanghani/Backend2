import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Apierror} from "../utils/Apierror.js"
import {Apiresponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleLikeHelper = async ({ userId, refId, refModel }) => {
  const existingLike = await Like.findOne({ user: userId, refId, refModel });

  if (existingLike) {
    await existingLike.deleteOne();
    return { liked: false };
  }

  await Like.create({ user: userId, refId, refModel });
  return { liked: true };
};

const toggleVideoLike = asyncHandler(async (req, res) => {
   const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new Apierror(400, "Invalid video ID");
  }

  const result = await toggleLikeHelper({
    userId: req.user._id,
    refId: videoId,
    refModel: "Video"
  })

  res.status(200).json(new Apiresponse(200, result, result.liked ? "Video liked" : "Video unliked"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new Apierror(400, "Invalid comment ID");
  }

  const result = await toggleLikeHelper({
    userId: req.user._id,
    refId: commentId,
    refModel: "Comment"
  });

  res.status(200).json(new Apiresponse(200, result, result.liked ? "Comment liked" : "Comment unliked"));
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new Apierror(400, "Invalid tweet ID");
  }

  const result = await toggleLikeHelper({
    userId: req.user._id,
    refId: tweetId,
    refModel: "Tweet"
  });

  res.status(200).json(new Apiresponse(200, result, result.liked ? "Tweet liked" : "Tweet unliked"));
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({
    user: req.user._id,
    refModel: "Video"
  }).populate({
    path: "refId",
    model: "Video"
  });

  const likedVideos = likes.map((like) => like.refId);

  res.status(200).json(new Apiresponse(200, likedVideos, "Liked videos fetched"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
}