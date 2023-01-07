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

ratingRoutes.route("/avg/:id").get((req, res) => {
  const dbConnect = getDb();
  const id = new ObjectId(req.params.id);

  dbConnect
    .collection("item")
    .aggregate([
      {
        $match: { _id: id},
      },
      {
        $unwind: "$rating",
      },
      {
        $group: {
          _id: id,
          avgRating: { $avg: "$rating.score" }
        },
      },
    ])
    .toArray((err: any, result: any) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.json({ avgRating: 0 });
      }
      res.json(result[0]);
    });
});

export default ratingRoutes;
