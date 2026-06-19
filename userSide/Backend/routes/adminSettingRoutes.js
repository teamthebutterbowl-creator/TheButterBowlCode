import express from "express";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  logoutAdmin,
  deleteAdminAccount,
  getCODStatus,  
  toggleCOD, 
  getPayOnlineEnabled ,
  toggleOnlinePay,
} from "../controllers/adminSettingController.js";
import  protect from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminMiddleware.js"

const router = express.Router();

router.get("/pay-online-status",getPayOnlineEnabled)

router.get("/cod-status", getCODStatus);


// All routes below require: valid JWT + role === admin or superAdmin
router.use(protect);
router.use(adminOnly);

router.get("/me", getAdminProfile);
router.put("/update-profile", updateAdminProfile);
router.put("/change-password", changeAdminPassword);
router.post("/logout", logoutAdmin);
router.delete("/delete-account", deleteAdminAccount);
router.put("/cod-status", toggleCOD); 
router.put("/pay-online-status",toggleOnlinePay)

export default router;