import mongoose from "mongoose";

const vlogSchema = new mongoose.Schema(
    {
        title: {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        photo: {
            type:String,  //cloudinary url
            required:true
        },
        story: {
            type:String,
            required:true,
            trim:true
        },
        userId: {
            type:String,
            required:true
        },
        views: {
          type:Number,
          default:0
        },
        likes: {
            type:Number, 
            default:0
        },
        likers:{
            type: Array,
            default:[]
        },
        dislikers:{
            type: Array,
            default:[]
        },
        dislikes: {
          type:Number, 
          default:0
        },
        viewers:{
            type: Array,
            default:[]
        },
        views:{
            type: Number,
            default:0
        },
        category:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const Vlog = mongoose.model("Vlog", vlogSchema)


// ['travel', 'lifestyle', 'fashion', 'fitness', 'health', 'technology', 'gaming', 'sport', 'food',
// 'family', 'education', 'craft', 'business', 'enterpreneurship', 'music', 'animal', 'pet', 'science',
// 'motivation', 'enterntainment', 'environment', 'art', 'dance', 'social issue', 'coding', 'wedding',
// 'car', 'bike', 'hip-hop', 'product']