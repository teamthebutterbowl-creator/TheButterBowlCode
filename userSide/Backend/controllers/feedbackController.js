import Feedback from "../models/feedbackModel.js";
import asyncHandler from "express-async-handler";

//submit form controller 

export const submitForm =asyncHandler(async(req, res)=>{
   const {name,phone,orderedItem,experience, bestPart, suggestion, orderAgain}=req.body;
   console.log(req.body);
   if(!phone){
    res.status(400)
    throw new Error("Phone number is required");
   }
   if (!/^[6-9]\d{9}$/.test(phone)) {
    res.status(400);
    throw new Error("Please enter a valid 10-digit phone number");
}
   if(!orderedItem){
    res.status(400)
    throw new Error("Orderd item is required ");
   }
   if(!experience){
    res.status(400)
    throw new Error("Experience is required");
   }
   const newFeedback= new Feedback(
    {
        name,
        phone,
        orderedItem,
        experience,
        bestPart,
        suggestion,
        orderAgain

    }
   );
   await newFeedback.save();

   res.status(201).json({
    success:true,
    message:"Feedback has been added",
    data:newFeedback,
   })


})

/// getting all the feedback for admin panel 
export const getAllFeedbacks= asyncHandler(async(req,res)=>{
    const feedbacks= await Feedback.find().sort({createdAt:-1}) //recent feedbacks first 
    res.status(200).json({
        success:true,
        count:feedbacks.length,
        data:feedbacks
    })
})

//delete a specific feedback 
export const deleteFeedback = asyncHandler(async(req,res)=>{
    const feedback= await Feedback.findById(req.params.id);
    if(!feedback){
        res.status(404)
        throw new Error("feedback does not exists");
    }
    await feedback.deleteOne();

       res.status(200).json({
        success: true,
        message: "Feedback deleted successfully"
    });
})