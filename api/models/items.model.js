import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    userRef: {
      type: String,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
      enum: ["Found", "Lost"],
    },

    dateFound: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Mobile Phones",
        "Laptops/Tablets",
        "Headphones/Earbuds",
        "Chargers and Cables",
        "Cameras",
        "Electronic Accessories",
        "Textbooks",
        "Notebooks",
        "Stationery Items",
        "Art Supplies",
        "Calculators",
        "Coats and Jackets",
        "Hats and Caps",
        "Scarves and Gloves",
        "Bags and Backpacks",
        "Sunglasses",
        "Jewelry and Watches",
        "Umbrellas",
        "Wallets and Purses",
        "ID Cards and Passports",
        "Keys",
        "Personal Care Items",
        "Sports Gear",
        "Gym Equipment",
        "Bicycles and Skateboards",
        "Musical Instruments",
        "Water Bottles",
        "Lunch Boxes",
        "Toys and Games",
        "Decorative Items",
        "Other",
      ],
    },
    status: {
      type: String,
      enum: ["Open", "Claimed", "Closed"],
      default: "Open",
    },
    claimantName: {
      type: String,
      default: "",
    },
    visibility: {
      type: Boolean,
      default: true, // True means visible, false means archived
    },
  },
  { timestamps: true }
);

itemSchema.index({ item: "text", description: "text", category: "text" }); // Including category in the text index

const Item = mongoose.model("Item", itemSchema);

export default Item;
