const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yus1g0f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // connect client to server
    // await client.connect();
    //  send a ping for connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connection successful");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir());

app.get("/", (req, res) => {
  res.send("Hello User");
});

app.listen(port, () => {
  console.log(`Listening port on ${port}`);
});
