import express from "express";
import { ObjectId } from "mongodb";
import { stringify } from "querystring";
import { getDb } from "../config/db";
import { Item } from "../models/Item";
import Order from "../models/Order";

const orderRoutes = express.Router();
const orderC = "orders";
const itemC = "item";
const deliveryC = "delivery"

interface DeliveryGroup {
  [key: string]: number;
}

function addKeyValue(obj: DeliveryGroup, key: string, value: number) {
  if (!(key in obj)) {
    obj[key] = value;
  } else {
    obj[key] += value;
  }
}

orderRoutes.route("/").post(async (req, res) => {
  const dbConnect = getDb();
  const newOrder = new Order(req);
  const deliveryGroup: DeliveryGroup = {};

  const customerAndDeliveryValues = [...Object.values(newOrder.customer), ...Object.values(newOrder.delivery_address)];
  if (customerAndDeliveryValues.some(value => value === null || value === undefined)) {
    res.send(500).json({ "message": "Wrong user or delivery data" })
  }

  const ids = newOrder.items.map((element) => {
    try {
      return new ObjectId(element.id);
    } catch (err: any) {
      res.status(500).json({ "message": `Wrong id (${err.message})` });
      return null;
    }
  });

  try {
    const items = await dbConnect
      .collection(itemC)
      .aggregate([
        {
          $match: { _id: { $in: ids } },
        },
      ])
      .toArray();

    if (items.length < newOrder.items.length) {
      res.status(500).json({ "message": "Some ids doesn't exist in db" });
    }

    items.forEach((item: any) => {
      const itemToBuy = newOrder.items.find((t) => t.id == item._id);
      const quantity = itemToBuy?.quantity;
      if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
        res.status(500).json({ message: `Wrong quantity value of ${item.name}: ${quantity} ` });
        return null;
      }

      if (quantity > item.quantity) {
        res.status(500).json({ message: `Not enough ${item.name} (${item.quantity} in stock) ` });
        return null;
      }
      addKeyValue(deliveryGroup, itemToBuy.delivery, item.price * quantity);
    });

    const orders_ids = Object.keys(deliveryGroup).map((element) => {
      try {
        return new ObjectId(element);
      } catch (err: any) {
        res.status(500).json({ "message": `Wrong id (${err.message})` });
        return null;
      }
    });

    const deliveries = await dbConnect
      .collection(deliveryC)
      .aggregate([
        {
          $match: { _id: { $in: orders_ids } },
        },
      ])
      .toArray();
    
    let without_delivery = 0;
    let total = 0;

    for(let i in deliveries){
      total += deliveryGroup[deliveries[i]._id]
      without_delivery += deliveryGroup[deliveries[i]._id]
      if (deliveryGroup[deliveries[i]._id]  < deliveries[i].free){
        total += deliveries[i].price
      }
    }

    res.json({total, without_delivery})

  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

export default orderRoutes;

// Im lack of few checks...
// Save and send order back