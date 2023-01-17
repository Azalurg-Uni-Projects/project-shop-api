import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db";
import Delivery from "../models/Delivery";
import Order from "../models/Order";

const orderRoutes = express.Router();
const collection = "orders";

// TODO Tests

// Get all deliverys
orderRoutes.route("/").get((req, res) => {
    const dbConnect = getDb();
  
    dbConnect
      .collection(collection)
      .toArray((err: any, result: any) => {
        if (err) throw err;
        res.json(result);
      });
  });
  
  // Get delivery by id
  orderRoutes.route("/:id").get((req, res) => {
    const dbConnect = getDb();
    const query = { _id: new ObjectId(req.params.id) };

    dbConnect
      .collection(collection)
      .findOne(query, (err: any, result: any) => {
        if (err) throw err;
        res.json(result);
      });
  });
  
  // Create delivery
  orderRoutes.route("/").post((req, res) => {
    const dbConnect = getDb();
    const delivery = new Delivery(req);
    dbConnect
      .collection(collection)
      .insertOne(delivery, (err: any, result: any) => {
        if (err) throw err;
        res.json(result);
      });
  });
  
  // Update delivery
  orderRoutes.route("/:id").put((req, res) => {
    const dbConnect = getDb();
    const query = { _id: new ObjectId(req.params.id) };
    const newValues = {
      $set: { ... new Delivery(req) },
    };

    dbConnect
      .collection(collection)
      .updateOne(query, newValues, { upsert: true }, (err: any, result: any) => {
        if (err) throw err;
        console.log("1 document updated successfully");
        res.json(result);
      });
  });
  
  
  // Remove delivery
  orderRoutes.route("/:id").delete((req, res) => {
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

export default orderRoutes;
