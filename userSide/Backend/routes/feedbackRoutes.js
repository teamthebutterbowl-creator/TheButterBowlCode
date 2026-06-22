import express from "express"
import {submitForm,getAllFeedbacks,deleteFeedback} from "../controllers/feedbackController.js"
import {adminOnly} from "../middleware/adminMiddleware.js";
const router= express.Router()

router.post("/",submitForm)
router.get("/",adminOnly,getAllFeedbacks)
router.delete("/:id",adminOnly,deleteFeedback)
export  default router;

