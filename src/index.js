import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import openapi from "./swagger.js";
import { fileURLToPath } from "url";
import { isDev, dev, prod } from "./banner.js";

dotenv.config();
const app = express();
app.set("trust proxy", 1);
const isDynamic = process.argv.includes('--dynamic');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/openapi.json", (req, res) => {
  let apiDoc;

  if (isDev) {
    apiDoc = { ...openapi };
  } else {
    const raw = fs.readFileSync(
      path.join(__dirname, "../dist/openapi-min.json"),
      "utf-8"
    );
    if(isDynamic) return res.send(raw);
    apiDoc = JSON.parse(raw);
  }

  const host = req.get("host");

  const protocol = host.includes("localhost")
    ? "http"
    : isDev
    ? req.protocol
    : "https";

  apiDoc.servers = [
    {
      url: `${protocol}://${host}`,
    },
  ];

  res.json(apiDoc);
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
