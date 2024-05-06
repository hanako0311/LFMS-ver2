import Item from "../models/items.model.js";
import { errorHandler } from "../utils/error.js";
import validator from "validator"; // npm install validator

export const createItem = async (req, res, next) => {
  console.log("Received headers:", req.headers);
  console.log("Received request body:", req.body);

  const {
    item,
    itemType,
    dateFound,
    location,
    description,
    imageUrls,
    category,
  } = req.body;

  if (
    !item ||
    !itemType ||
    !dateFound ||
    !location ||
    !description ||
    !category ||
    !imageUrls ||
    imageUrls.length === 0
  ) {
    console.log("Validation failed: Required fields are missing or incomplete");
    return next(
      errorHandler(
        400,
        "Please fill in all required fields, including image URLs"
      )
    );
  }

  if (!imageUrls.every((url) => validator.isURL(url))) {
    console.log("Validation failed: One or more image URLs are invalid");
    return next(errorHandler(400, "Please provide valid URLs for all images"));
  }

  const newItem = new Item({
    item,
    itemType, // Ensure this is included and correctly passed
    dateFound,
    location,
    description,
    imageUrls,
    category,
    userRef: req.user.id,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error saving item:", error);
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Constructing the query object
    let query = {};
    if (req.query.item) query.item = req.query.item;
    if (req.query.category) query.category = req.query.category;
    if (req.query.searchTerm) {
      query.$or = [
        { item: { $regex: req.query.searchTerm, $options: "i" } },
        { description: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const items = await Item.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: sortDirection });

    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    next(error);
  }
};

export const getItemDetails = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const claimItem = async (req, res) => {
  const { id } = req.params;
  const { claimantName } = req.body;

  if (!claimantName) {
    return res.status(400).json({ message: "Claimant name is required" });
  }

  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.status === "Claimed") {
      return res
        .status(400)
        .json({ message: "This item has already been claimed." });
    }

    item.status = "Claimed";
    item.claimantName = claimantName;
    item.visibility = false; // Hide the item from public view
    await item.save();

    console.log("Updated Item:", item); // Debug log

    res.status(200).json({ message: "Item claimed successfully", item });
  } catch (error) {
    console.error("Error updating item claim:", error);
    res.status(500).json({ message: "Error processing claim" });
  }
};

export const searchItems = async (req, res) => {
  const { searchTerm = "", sort = "desc", category = "all" } = req.query;

  let queryOptions = { visibility: true };
  if (searchTerm) {
    queryOptions.$text = { $search: searchTerm };
  }
  if (category !== "all") {
    queryOptions.category = category;
  }

  try {
    const items = await Item.find(queryOptions)
      .sort({ createdAt: sort === "desc" ? -1 : 1 })
      .exec();
    res.json({ success: true, items });
  } catch (error) {
    console.error("Error searching items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search items",
      error: error.message,
    });
  }
};
