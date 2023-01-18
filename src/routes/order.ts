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

// Get all orders
orderRoutes.route("/").get((req, res) => {
  const dbConnect = getDb();
  const filter = JSON.parse(req.query.filter?.toString() || "{}");
  const sort = JSON.parse(req.query.sort?.toString() || "{}");

  dbConnect
    .collection(orderC)
    .find(filter)
    .sort(sort)
    .toArray((err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

// Get orders stats
orderRoutes.route("/stats").get((req, res) => {
  const dbConnect = getDb();

  dbConnect
    .collection(orderC)
    .aggregate([
      {
          $group: {
              _id: "$payed",
              count: { $sum: 1 },
              earned: { $sum: "$price" }
          }
      },
      {
          $project: {
            _id: 0,
            payed: "$_id",
            count: "$count",
            earned: "$earned"
          }
      }
  ])
    .toArray((err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

// Get item by id
orderRoutes.route("/:id").get((req, res) => {
  const dbConnect = getDb();
  const query = { _id: new ObjectId(req.params.id) };

  dbConnect
    .collection(orderC)
    .findOne(query, (err: any, result: any) => {
      if (err) throw err;
      res.json(result);
    });
});

// Create delivery
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

    for (let i in deliveries) {
      total += deliveryGroup[deliveries[i]._id]
      without_delivery += deliveryGroup[deliveries[i]._id]
      if (deliveryGroup[deliveries[i]._id] < deliveries[i].free) {
        total += deliveries[i].price
      }
    }

    newOrder.price = without_delivery;
    newOrder.total_price = without_delivery;

    await dbConnect
      .collection(orderC)
      .insertOne(newOrder, (err: any, result: any) => {
        if (err) throw err;
        res.status(201).json(result);
      });

  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

// Pay for order
orderRoutes.route("/:id").put(async (req, res) => {
  const dbConnect = getDb();
  const query = { _id: new ObjectId(req.params.id) };
  const newValues = { $set: { payed: true } };

  try {

    const order = await dbConnect
      .collection(orderC)
      .findOne(query);
     
    if(order.payed){
      res.status(500).json({message: `Order ${order._id} already payed`})
      return
    }
      
    await dbConnect
      .collection(orderC)
      .updateOne(query, newValues, { upsert: true });

    

    order.items.forEach(async (item: {id: string, quantity: number, delivery: string}) =>{
      const item_id = new ObjectId(item.id);
      await dbConnect
        .collection(itemC)
        .updateOne({_id: item_id}, {$inc: {quantity: -item.quantity}})
    })

    res.status(200).json(order);

  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

export default orderRoutes;
