import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createItem,
  getItems,
  getItemDetails,
  claimItem,
  searchItems,
} from "../controller/items.controller.js"; // Import getItems here

const router = express.Router();

router.post("/report", verifyToken, createItem);
router.get("/getItems", getItems); // Now getItems should be recognized
router.get("/:id", verifyToken, getItemDetails);
router.post("/claim/:id", verifyToken, claimItem);

export default router;
