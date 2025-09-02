const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "StockItem", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "TeamMember" },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", SaleSchema);


