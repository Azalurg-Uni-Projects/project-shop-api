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



orderRoutes.route("/").post((req, res) => {
  const dbConnect = getDb();
  const newOrder = new Order(req);

  res.status(201).json(newOrder)
  
});

export default orderRoutes;

// Check user data and address 
// Check items
// Count total
// Save and send order back