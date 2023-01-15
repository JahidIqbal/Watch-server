const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sbyjk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("JIWatch");
    const servicesCollection = database.collection("services");
    console.log("database connected");
    const orderCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const ratingCollection = database.collection("ratings");

    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //Add Orders API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    // get
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      console.log("delete order with id", result);
      res.json(result);
    });
    //render
    // getting manage all orders
    app.get("/manageAllOrders", async (req, res) => {
      const cursor = orderCollection.find({});
      const manageOrders = await cursor.toArray();
      res.send(manageOrders);
    });

    // update order status
    app.put("/manageAllOrders/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: { status: updateStatus.status } };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
      console.log(result);
    });

    // manage products
    app.get("/manageProducts", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // delete manage product by id
    app.delete("/manageProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      console.log("delete order with id", result);
      res.json(result);
    });

    // post users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // add new product
    app.post("/services", async (req, res) => {
      const newProduct = req.body;
      const result = await servicesCollection.insertOne(newProduct);
      res.json(result);
    });

    // ratings
    app.post("/ratings", async (req, res) => {
      const rating = req.body;
      const result = await ratingCollection.insertOne(rating);
      res.json(result);
    });

    // get ratings
    app.get("/ratings", async (req, res) => {
      const cursor = ratingCollection.find({});
      const ratings = await cursor.toArray();
      res.send(ratings);
    });

    // Get Add New Services
    app.get("/services", async (req, res) => {
      const getNewProduct = servicesCollection.find({});
      const addNewProduct = await getNewProduct.toArray();
      res.send(addNewProduct);
    });

    // put method here
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // admin role here
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // finding specific admin by email
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("JI Watch server running");
});

app.listen(port, () => {
  console.log("JI Watch running on port", port);
});
