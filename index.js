const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
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

    const database = client.db("jobsDB");
    const jobs = database.collection("jobs");

    //  jwt
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2h",
      });
      res.send({ token });
    });

    // middlewares
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      // console.log(token);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, dec) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized access" });
        }
        req.dec = dec;

        next();
      });
    };

    app.post("/jobs", verifyToken, async (req, res) => {
      const job = req.body;
      const result = await jobs.insertOne(job);
      res.send(result);
    });

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
