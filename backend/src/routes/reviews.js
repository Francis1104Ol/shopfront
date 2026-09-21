const express = require("express");
const Review = require("../models/Review");
const Order = require("../models/Order");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /product/:productId — list reviews for a product
router.get("/product/:productId", async (req, res) => {
  try{
    const {productId} = req.params
    const
     reviews = await Review.find({product: productId})
     .populate("user", "name")
     .sort({createdAt: -1})
     res.json(reviews);

  }catch(error){
    res.status(500).json({message: "server error fetching reviews"})
  }
});

// POST /product/:productId — create a review
router.post("/product/:productId", requireAuth, async (req, res) => {
  try{
    const {productId} = req.params
    const {rating, comment} = req.body;
    const userId = req.user.id;
    if (!rating || !comment){
        return res.status(400).json({message: "Rating and comment are required"})
    }

const existingOrder = await Order.findOne({
    user: userId,
    status: {$in: ["paid", "shipped"]},
    "items.product": productId
});
const verifiedPurchase = !!existingOrder;

const review = await Review.create({
    product: productId,
    user:userId,
    rating,
    comment,
    verifiedPurchase
})
res.status(201).json(review)

  }catch(error){
    if(error.code === 11000){
        return res.status(400).json({message: "You have  already reviewed this product"})
    }
    res.status(500).json({message: "Server error creating review"})
  }
});

// PUT /:reviewId — edit your own review
router.put("/:reviewId", requireAuth, async (req, res) => {
  try{
    const {reviewId} = req.params
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review){
        return res.status(404).json({message: "Review not found"})
    }
    if (review.user.toString()!==userId){
        return res.status(403).json({message: "Not authorised to edit this review"})
    }
    if (rating !== undefined) review.rating =rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();
    res.json(review)
  }catch(error){
     res.status(500).json({ message: "Server error updating review" });
  }
});

module.exports = router;