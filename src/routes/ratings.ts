import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db";
import Rating from "../models/Rating";

const ratingRoutes = express.Router();
const collection = "item"

ratingRoutes.route("/").get((req, res) => {
  const dbConnect = getDb();

  dbConnect
    .collection(collection)
    .aggregate([
      
      {
        $project: {
          _id: 1,
          rating: 1
        },
      },
    ])
  .toArray((err: any, result: any) => {
    if (err) throw err;
    res.json(result);
  });
})

ratingRoutes.route("/stats").get((req, res) => {
  const dbConnect = getDb();

  dbConnect
    .collection(collection)
    .aggregate([
      {
        $unwind: "$rating",
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          sum: { $sum: "$rating.score" },
          avg: { $avg: "$rating.score" },
          withDescriptionCount: { $sum: { $cond: [ {$ne: ["$rating.description", ""]}, 1, 0] }},
          withoutDescriptionCount: { $sum: { $cond: [ {$eq: ["$rating.description", ""]}, 1, 0] }},
          oneStarCount: { $sum: { $cond: [ {$eq: ["$rating.score", 1]}, 1, 0] }},
          twoStarCount: { $sum: { $cond: [ {$eq: ["$rating.score", 2]}, 1, 0] }},
          threeStarCount: { $sum: { $cond: [ {$eq: ["$rating.score", 3]}, 1, 0] }},
          fourStarCount: { $sum: { $cond: [ {$eq: ["$rating.score", 4]}, 1, 0] }},
          fiveStarCount: { $sum: { $cond: [ {$eq: ["$rating.score", 5]}, 1, 0] }},
        },
      },
      {
        $project: { 
          _id: 0,
          count: "$count",
          sum: "$sum",
          avg: {$round: ["$avg", 2]},
          withDescriptionCount: "$withDescriptionCount",
          withoutDescriptionCount: "$withoutDescriptionCount",
          oneStarCount: "$oneStarCount",
          twoStarCount: "$twoStarCount",
          threeStarCount: "$threeStarCount",
          fourStarCount: "$fourStarCount",
          fiveStarCount: "$fiveStarCount"
        },
        
      }
    ])
    .toArray((err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

ratingRoutes.route("/:id").get((req, res) => {
  const dbConnect = getDb();
  const query = { _id: new ObjectId(req.params.id) };
  dbConnect
    .collection(collection)
    .aggregate([
      {
        $match: query
      },
      {
        $project: {
          _id: 1,
          rating: 1
        },
      },
    ])
  .toArray((err: any, result: any) => {
    if (err) throw err;
    res.json(result);
  });
})

ratingRoutes.route("/:id").post((req, res) => {
  const dbConnect = getDb();
  const query = { _id: new ObjectId(req.params.id) };
  const newRating = new Rating(req);
  dbConnect
    .collection(collection)
    .updateOne(query, { $push: { rating: newRating } }, (err: any, result: any) => {
      if (err) throw err;
      console.log("1 document updated successfully");
      res.json(result);
    });
});

ratingRoutes.route("/avg/:id").get((req, res) => {
  const dbConnect = getDb();
  const id = new ObjectId(req.params.id);

  dbConnect
    .collection(collection)
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
          avg: { $avg: "$rating.score" }
        }
      },
      {
        $project: {
          avg: {$round: ["$avg", 2]}, 
        }
      }
    ])
    .toArray((err: any, result: any) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.json({ avg: 0 });
      }
      res.json(result[0]);
    });
});

export default ratingRoutes;
