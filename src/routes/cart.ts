import express from "express";
import { ObjectId } from "mongodb";
import { stringify } from "querystring";
import { getDb } from "../config/db";
import { Item } from "../models/Item";

const cartRoutes = express.Router();
const collection = "item";

cartRoutes.route("/").post((req, res) => {
  const dbConnect = getDb();
  const cart: { id: string; quantity: number }[] = req.body.cart;
  let ids: ObjectId[] = [];

  cart.forEach((element) => {
    ids = [...ids, new ObjectId(element.id)];
  });

  let total = 0;
  let send = false;

  dbConnect
    .collection(collection)
    .aggregate([
      {
        $match: { _id: { $in: ids } },
      },
    ])
    .toArray((err: any, result: any) => {
      if (err) throw err;
      result.forEach((item: any) => {
        const quantity = cart.find((t) => t.id == item._id)?.quantity;
        if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
          res
            .status(500)
            .json({
              message: `Wrong quantity value of ${item.name}: ${quantity} `,
            });
          send = true;
          return
        }

        if (quantity > item.quantity) {
          res
            .status(500)
            .json({
              message: `Not enough ${item.name} (${item.quantity} in stock) `,
            });
          send = true;
          return;
        }

        total += quantity * item.price;
      });

      if (!send) {
        res.status(200).json({ message: "cart is correct", total: total });
      }
    });
});

export default cartRoutes;
