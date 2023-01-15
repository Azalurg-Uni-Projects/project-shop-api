import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db";
import { Item } from "../models/Item";

const itemRoutes = express.Router();
const collection = "item"

// Get all items
itemRoutes.route("/").get((req, res) => {
  const dbConnect = getDb();
  const filter = JSON.parse(req.query.filter?.toString() || "{}"); 
  const sort = JSON.parse(req.query.sort?.toString() || "{}");

  dbConnect
    .collection(collection)
    .find(filter)
    .sort(sort)
    .toArray((err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

// Get item by id
itemRoutes.route("/:id").get((req, res) => {
  const dbConnect = getDb();
  const query = { _id: new ObjectId(req.params.id) };
  dbConnect
    .collection(collection)
    .findOne(query, (err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

// Create item
itemRoutes.route("/").post((req, res) => {
  const dbConnect = getDb();
  const item = new Item(req);
  dbConnect
    .collection(collection)
    .insertOne(item, (err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

// Update item
itemRoutes.route("/:id").put((req, res) => {
    const dbConnect = getDb();
    const query = { _id: new ObjectId(req.params.id) };
    const newValues = {
      $set: {... new Item(req)},
    };
    console.log(newValues);
    dbConnect
      .collection(collection)
      .updateOne(query, newValues, { upsert: true }, (err: any, result: any) => {
        if (err) throw err;
        console.log("1 document updated successfully");
        res.json(result);
      });
  });


// Remove item
itemRoutes.route("/:id").delete((req, res) => {
  const dbConnect = getDb();
  const query = { _id: new ObjectId(req.params.id) };
  dbConnect
    .collection(collection)
    .deleteOne(query, (err: any, result: Response) => {
      if (err) throw err;
      console.log("1 document deleted");
      res.json(result);
    });
});

export default itemRoutes;
