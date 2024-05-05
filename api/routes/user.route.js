import express from "express";
import {
  deleteUser,
  signout,
  test,
  updateUser,
  changePassword,
} from "../controller/user.controller.js";
import {
  verifyToken,
  verifyAdmin,
  verifySuperAdmin,
} from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update-user/:userId", verifyToken, updateUser);
router.delete("/delete-user/:userId", verifyToken, deleteUser);
router.put(
  "/change-password/:userId",
  verifyToken,
  verifyAdmin,
  changePassword
);
router.post("/signout", signout);

export default router;
