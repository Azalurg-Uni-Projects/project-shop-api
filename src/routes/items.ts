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

// recordRoutes.route("/update/:id").post((req, response) => {
//     const dbConnect = getDb("employees");
//     const myquery = { _id: ObjectId(req.params.id) };
//     const newValues = {
//       $set: {
//         name: req.body.name,
//         position: req.body.position,
//         level: req.body.level,
//       },
//     };
//     dbConnect
//       .collection("records")
//       .updateOne(myquery, newValues, (err, res) => {
//         if (err) throw err;
//         console.log("1 document updated successfully");
//         response.json(res);
//       });
//   });

//   recordRoutes.route("/:id").delete((req, res) => {
//     const dbConnect = getDb("employees");
//     const myquery = { _id: ObjectId(req.params.id) };
//     dbConnect
//       .collection("records")
//       .deleteOne(myquery, (err, obj) => {
//         if (err) throw err;
//         console.log("1 document deleted");
//         res.json(obj);
//       });
//   });

export default itemRoutes;
