import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db";
import { Item } from "../models/Item";

const itemRoutes = express.Router();

itemRoutes.route("/").get((req, res) => {
  const dbConnect = getDb();
  dbConnect
    .collection("item")
    .find({})
    .toArray((err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

// recordRoutes.route("/record/:id").get((req, res) => {
//   const dbConnect = getDb("employees");
//   const myquery = { _id: ObjectId(req.params.id) };
//   dbConnect
//     .collection("records")
//     .findOne(myquery, (err, result) => {
//       if (err) throw err;
//       res.json(result);
//     });
// });

itemRoutes.route("/").post((req, response) => {
  const item = new Item(req);
  const dbConnect = getDb();
  dbConnect
    .collection("item")
    .insertOne(item, (err: any, res: any) => {
      if (err) throw err;
      response.json(res);
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
