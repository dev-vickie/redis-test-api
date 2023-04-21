const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Redis = require("redis");
const redisClient = Redis.createClient();

const DEFAULT_EXPIRATION_TIME = 3600;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 3000;

app.get("/photos", async (req, res) => {
const albumId = req.query.albumId;

  const { data } = await axios.get(
    "https:jsonplaceholder.typicode.com/photos",
    { params: { albumId } }
  );

  redisClient.setEx("photos", DEFAULT_EXPIRATION_TIME, JSON.stringify(data));

  res.status(200).send(data);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
