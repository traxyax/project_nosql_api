import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of 50 orders
router.get("/", async (req, res) => {
  let collection = await db.collection("orders");
  let results = await collection.find({}).limit(50).toArray();
  res.send(results).status(200);
});

// Fetches the latest orders
router.get("/latest", async (req, res) => {
  let collection = await db.collection("orders");
  let results = await collection
    .aggregate([{ $sort: { date: -1 } }, { $limit: 10 }])
    .toArray();
  res.send(results).status(200);
});

// Get a single order
router.get("/:id", async (req, res) => {
  let collection = await db.collection("orders");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Add a new document to the collection
router.post("/", async (req, res) => {
  let collection = await db.collection("orders");
  let newDocument = req.body;

  // Convert fields to correct data types
  newDocument.vendor_id = parseInt(newDocument.vendor_id, 10);
  newDocument.chain_id = parseInt(newDocument.chain_id, 10);
  newDocument.city_id = parseInt(newDocument.city_id, 10);
  newDocument.successful_orders = parseInt(newDocument.successful_orders, 10);
  newDocument.fail_orders = parseInt(newDocument.fail_orders, 10);

  newDocument.date = new Date();
  let result = await collection.insertOne(newDocument);

  res.send(result).status(204);
});

// Delete an entry
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const collection = db.collection("orders");
  let result = await collection.deleteOne(query);
  res.send(result).status(200);
});

export default router;
