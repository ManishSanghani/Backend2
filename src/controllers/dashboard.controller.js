import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { Apierror } from "../utils/Apierror.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new Apierror(400, "Invalid channel ID"); 
    }

    // Total videos
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Total likes on all videos
    const totalLikes = await Like.countDocuments({ videoOwner: channelId });

    // Total views from all videos
    const viewResult = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = viewResult[0]?.totalViews || 0;

    res.status(200).json(new Apiresponse(200, {
        totalVideos,
        totalSubscribers,
        totalLikes,
        totalViews
    }));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new Apierror(400, "Invalid channel ID");
    }

    const sortOrder = sortType === "asc" ? 1 : -1;

    const videos = await Video.find({ owner: channelId, published: true })
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Video.countDocuments({ owner: channelId, published: true });

    res.status(200).json(new Apiresponse(200, {
        videos,
        totalVideos: total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
    }));
});

export {
    getChannelStats, 
    getChannelVideos
    }