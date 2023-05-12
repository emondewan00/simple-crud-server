const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, Db, ObjectId } = require("mongodb");
const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());



const uri =
  "mongodb+srv://{username in env.local file}:{pass in env.local file}@cluster0.jmqwkqq.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("usersDb");
    const userCallection = database.collection("user");

    app.get("/user", async (req, res) => {
      const cursor = userCallection.find();
      const result = await cursor.toArray();
      res.json(result);
    });
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCallection.insertOne(user);
      res.send(result);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const data = userCallection.findOne({ _id: new ObjectId(id) });
      const result = await data;
      res.send(result);
    });
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const doc = req.body;
      const result = await userCallection.updateOne(
        { _id: new ObjectId(id) },
        { $set: doc }
      );
      console.log(result);
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const deleted = await userCallection.deleteOne({ _id: new ObjectId(id) });
      res.send(deleted);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("halllo");
});

app.listen(port, () => {
  console.log("i am listening on port 5000");
});
