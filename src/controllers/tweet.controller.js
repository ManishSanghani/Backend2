import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {Apierror} from "../utils/Apierror.js"
import {Apiresponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

  if (!content?.trim()) {
    throw new Apierror(400, "Tweet content is required");
  }

  const tweet = await Tweet.create({
    content,
    user: req.user._id
  });

  res.status(201).json(
    new Apiresponse(201, tweet, "Tweet created successfully")
  );
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new Apierror(400, "Invalid user ID");
  }

  const tweets = await Tweet.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("user", "username avatar");

  res.status(200).json(
    new Apiresponse(200, tweets, "User tweets fetched")
  );
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new Apierror(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new Apierror(404, "Tweet not found");
  }

  if (!tweet.user.equals(req.user._id)) {
    throw new Apierror(403, "You can only update your own tweets");
  }

  tweet.content = content || tweet.content;
  await tweet.save();

  res.status(200).json(
    new Apiresponse(200, tweet, "Tweet updated")
  );
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new Apierror(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new Apierror(404, "Tweet not found");
  }

  if (!tweet.user.equals(req.user._id)) {
    throw new Apierror(403, "You can only delete your own tweets");
  }

  await tweet.deleteOne();

  res.status(200).json(
    new Apiresponse(200, {}, "Tweet deleted")
  );
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}