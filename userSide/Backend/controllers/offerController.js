import Offer from "../models/offerModel.js";

// CREATE OFFER
export const createOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
     // Populate before returning
     await offer.populate([
      { path: 'applicableProducts', select: 'name price image' },
      { path: 'applicableCategories', select: 'name' },
    ]);

    res.status(201).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveOffers = async (req, res, next) => {
    try {
      const now = new Date();
  
      const offers = await Offer.find({
        isActive: true,
        $or: [
          { startDate: { $lte: now } },
          { startDate: null },
        ],
        $or: [
          { endDate: { $gte: now } },
          { endDate: null },
        ],

      })  .populate('applicableProducts', 'name price image')   
      .populate('applicableCategories', 'name')
      .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: offers.length,
        data: offers,
      });
    } catch (error) {
      next(error);
    }
  };
//(ADMIN)
  export const getAllOffers = async (req, res, next) => {
    try {
      const offers = await Offer.find().sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: offers.length,
        data: offers,
      });
    } catch (error) {
      next(error);
    }
  };

  export const updateOffer = async (req, res, next) => {
    try {
      const offer = await Offer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!offer) {
        return res.status(404).json({
          success: false,
          message: "Offer not found",
        });
      }
  
      res.status(200).json({
        success: true,
        data: offer,
      });
    } catch (error) {
      next(error);
    }
  };

  export const toggleOfferStatus = async (req, res, next) => {
    try {
      const offer = await Offer.findById(req.params.id);
  
      if (!offer) {
        return res.status(404).json({
          success: false,
          message: "Offer not found",
        });
      }
  
      offer.isActive = !offer.isActive;
      await offer.save();
  
      res.status(200).json({
        success: true,
        data: offer,
      });
    } catch (error) {
      next(error);
    }
  };
  export const deleteOffer = async (req, res, next) => {
    try {
      await Offer.findByIdAndDelete(req.params.id);
  
      res.status(200).json({
        success: true,
        message: "Offer deleted",
      });
    } catch (error) {
      next(error);
    }
  };