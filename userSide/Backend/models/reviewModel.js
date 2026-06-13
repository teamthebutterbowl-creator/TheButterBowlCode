import mongoose from "mongoose"
/**
 * Review schema — stores reviews for each product.
 * Reviews can come from website or other platforms (Zomato, Swiggy etc.)
 */
const reviewSchema=mongoose.Schema(
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:[true,"Product ID is required"],
        },
        customerName:{
            type:String,
            required:[true,"Customer name is required"],
            trim:true
        },
         // Rating — 1 to 5 stars
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
      },
        // Where did this review come from?
    source: {
        type: String,
        enum: ["website", "zomato", "swiggy", "google", "google_form", "instagram","whatsapp","other"],
        default: "website",
      },
     // Review text — optional
    comment: {
        type: String,
        trim: true,
      },
      userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     },
     
     images:[
        {
           type:String
        }
     ],
     
     isApproved:{
        type:Boolean,
        default:true
     }
    },
    {timestamps:true}
);
const Review=mongoose.model("Review",reviewSchema);
export default Review;