import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import openapi from "./swagger.ts";
import { fileURLToPath } from "url";
import { isDev, dev, prod } from "./banner.ts";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/openapi.json", (req, res) => {
  if (isDev) {
    res.json(openapi);
  } else {
    res.sendFile(path.join(__dirname, "../dist/openapi-min.json"));
  }
});

app.use(
  "/swagger",
  apiReference({
    url: "./openapi.json",
  }),
);

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.get("/", (req, res) => {
  res.redirect("/swagger");
});

app.listen(3000, () => {
  console.log(isDev ? dev : prod);
  console.log("http://localhost:3000");
});
