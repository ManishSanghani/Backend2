import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {Apierror} from "../utils/Apierror.js"
import {Apiresponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new Apierror(400, "Invalid channel ID");
    }

    if (req.user._id.equals(channelId)) {
        throw new Apierror(400, "You cannot subscribe to yourself");
    }

    const existingSub = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    });

    if (existingSub) {
        await existingSub.deleteOne();
        return res.status(200).json(
            new Apiresponse(200, { subscribed: false }, "Unsubscribed from channel")
        );
    }

    await Subscription.create({
        channel: channelId,
        subscriber: req.user._id
    });

    res.status(200).json(
        new Apiresponse(200, { subscribed: true }, "Subscribed to channel")
    );
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new Apierror(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username avatar email");

    res.status(200).json(
        new Apiresponse(200, subscribers, "Subscribers fetched")
    );
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new Apierror(400, "Invalid subscriber ID");
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username avatar email");

    res.status(200).json(
        new Apiresponse(200, channels, "Subscribed channels fetched")
    );
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}