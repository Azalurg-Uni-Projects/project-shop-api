import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectToServer } from "./config/db";
import itemRoutes from "./routes/items";
import ratingRoutes from "./routes/ratings";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/order";
import deliveryRoutes from "./routes/delivery";
config({ path: ".env" });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/items", itemRoutes);
app.use("/ratings", ratingRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/delivery", deliveryRoutes);

app.listen(port, () => {
  connectToServer((err: any) => {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
