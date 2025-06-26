import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema(
    {
        videofile:{
            type:String, //cloudinary url
            require:true,
        },
        thumbnail:{
            type:String, //cloudinary url
            require:true,
        },
        title:{
            type:String,
            require:true,
        },
        description:{
            type:String,
            require:true,
        },
        duration:{
            type:String, //cloudinary url
            require:true,
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            defaul:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
    },
    {timestamps:true})



videoSchema.plugin(mongooseAggregatePaginate)
// export const Video=model("Vedio",videoSchema)
export const Video=mongoose.model("Video",videoSchema) 
