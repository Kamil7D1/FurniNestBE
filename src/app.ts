import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { customerRoutes } from "./routes/customerRoutes";

dotenv.config();

const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  console.error("ERROR: SECRET_KEY is not defined in environment variables");
  process.exit(1);
}

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/customer", customerRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
