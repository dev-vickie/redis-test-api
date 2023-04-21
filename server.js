const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Redis = require("ioredis");
const redisClient = new Redis();

const DEFAULT_EXPIRATION_TIME = 3600;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/photos", async (req, res) => {
  console.log(`Redis cache status: ${redisClient.status}`);

  redisClient.get("photos", async (err, photos) => {
    if (err) console.error(err);

    if (photos != null) {
      console.log("Data fetched from cache");
      return res.json(JSON.parse(photos));
    } else {
      const { data } = await axios.get("https://picsum.photos/v2/list");
      redisClient.setex("photos", DEFAULT_EXPIRATION_TIME, JSON.stringify(data));
      console.log("Data fetched from API");
      res.json(data);
    }
  });
});

app.listen(3000, () => {
  console.log(`Server running on PORT 3000`);
});
