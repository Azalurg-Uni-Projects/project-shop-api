import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db";
import { Item } from "../models/Item";

const itemRoutes = express.Router();
const collection = "item"

itemRoutes.route("/").get((req, res) => {
  const dbConnect = getDb();
  dbConnect
    .collection(collection)
    .find({})
    .toArray((err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

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

// Todo: It don't work...

itemRoutes.route("/:id").put((req, res) => {
    const dbConnect = getDb();
    const query = { _id: new ObjectId(req.params.id) };
    const newValues = {
      $set: {... new Item(req)},
    };
    console.log(newValues);
    dbConnect
      .collection("records")
      .updateOne(query, newValues, { upsert: true }, (err: any, result: any) => {
        if (err) throw err;
        console.log("1 document updated successfully");
        res.json(result);
      });
  });

  // Todo: It don't work too...

  itemRoutes.route("/:id").delete((req, res) => {
    const dbConnect = getDb();
    const query = { _id: new ObjectId(req.params.id) };
    dbConnect
      .collection("records")
      .deleteOne(query, (err: any, result: Response) => {
        if (err) throw err;
        console.log("1 document deleted");
        res.json(result);
      });
  });

export default itemRoutes;
