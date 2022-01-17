import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { errorMiddleWare } from "./middlewares/error.js";
import { resJson } from "./models/res_json.js";
import { route as users } from "./routes/users.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  resJson(res, 200, "This is facebook backend demo");
});

app.use("/users", users);

// * error middlewares
app.use(errorMiddleWare);
app.use("*", (req, res) => {
  res.status(404).send("Resource not found");
});

var PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Running on the PORT : ${PORT}`));
