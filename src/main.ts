import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectToServer } from "./config/db";
import itemRoutes from "./routes/items";
import ratingRoutes from "./routes/rating";
config({ path: ".env" });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/item", itemRoutes);
app.use("/rating", ratingRoutes);

app.listen(port, () => {
  connectToServer((err: any) => {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
