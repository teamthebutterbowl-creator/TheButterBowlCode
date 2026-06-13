import Contact from '../models/contactModel.js';

// @desc   Submit contact/reservation form
// @route  POST /api/contact
// @access Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email) {
      res.status(400);
      throw new Error('Name and email are required');
    }

    const contact = await Contact.create({
      name, email, message,
    });

    res.status(201).json({
      success: true,
      message: 'Message received! We will contact you shortly.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all contact submissions (admin)
// @route  GET /api/contact
// @access Private/Admin
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    next(error);
  }
};

//update api for updates or status updates
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    contact.status = status;
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

//delete 
export const deleteContact = async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
};
//get single contact
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};