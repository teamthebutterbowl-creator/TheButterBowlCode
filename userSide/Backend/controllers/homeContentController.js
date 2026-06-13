import HomeContent from "../models/homeContentModel.js";

// -------------------------
// CREATE / UPDATE HOME CONTENT (CMS - SINGLE DOC)
// -------------------------
export const upsertHomeContent = async (req, res, next) => {
  try {
    const content = await HomeContent.findOneAndUpdate(
      {}, // always target single document
      req.body,
      {
        new: true,
        upsert: true,        // create if not exists
        runValidators: true, // validate schema
      }
    );

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------
// GET HOME CONTENT (PUBLIC)
// -------------------------
export const getHomeContent = async (req, res, next) => {
  try {
    const content = await HomeContent.findOne({ isActive: true });

    res.status(200).json({
      success: true,
      data: content || {}, // safe fallback
    });
  } catch (error) {
    next(error);
  }
};