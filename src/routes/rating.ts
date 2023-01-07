import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db";
import Rating from "../models/Rating";

const ratingRoutes = express.Router();

// Todo: Why all my edits and deletes don't work? 

ratingRoutes.route("/:id").post((req, res) => {
  const dbConnect = getDb();
  const query = { _id: new ObjectId(req.params.id) };
  const newRating = new Rating(req);
  dbConnect
    .collection("items")
    .updateOne(query, { $push: { rating: newRating } }, (err: any, result: any) => {
      if (err) throw err;
      console.log("1 document updated successfully");
      res.json(result);
    });
});

ratingRoutes.route("/amount").get((req, res) => {
  const dbConnect = getDb();

  dbConnect
    .collection("item")
    .aggregate([
      {
        $unwind: "$rating",
      },
      {
        $group: {
          _id: null,
          totalRatingCount: { $sum: 1 },
        },
      },
    ])
    .toArray((err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

export default ratingRoutes;