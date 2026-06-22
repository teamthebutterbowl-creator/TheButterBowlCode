import mongoose from "mongoose";
const feedbackSchema= new mongoose.Schema({
    name:{
      type:String,
      trim:true,
  
    },
    phone:{
        type:String,
        required: [true, "Mobile number is required"],
        trim:true,
        match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"]
    },
   orderedItem: [{
    type: String,
    required:true,
    enum: [
    "Butter Rajma Bowl",
    "Butter Chole Bowl",
    "Combo Meal",
    "Lassi",
    "Other",
  ],
}],
    experience: {
      type: String,
      required: [true, "Experience rating is required"],
      enum: [
        "⭐⭐⭐⭐⭐ Loved it",
        "⭐⭐⭐⭐ Good",
        "⭐⭐⭐ Average",
        "⭐⭐ Needs Improvement",
        "⭐ Poor",
      ],
    },
       bestPart: [
      {
        type: String,
        enum: [
          "Taste",
          "Packaging",
          "Portion Size",
          "Freshness",
          "Delivery",
          "Presentation",
        ],
      },
    ],
    suggestion:{
        type:String,
        trim:true,
    },
       orderAgain: {
      type: String,
      enum: [
        "Definitely",
        "Maybe",
        "Not sure",
      ],
    },

},{
    timestamps:true
})

const  Feedback = mongoose.model("Feedback",feedbackSchema);
export default Feedback;