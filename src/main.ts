import express, { Request, Response } from "express";
const app = express();

const PORT = 3000

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Hello there" });
});

app.listen(PORT, (): void => {
  console.log(`Server Running on port ${PORT}`);
});