
const express = require("express");
const crypto = require("crypto");

const app = express();

app.use(express.json());

const links = new Map();

app.post("/api/shorten", (req, res) => {
  try {
    const url = new URL(req.body.url);

    if (!["http:", "https:"].includes(url.protocol)) {
      return res.status(400).json({
        error: "Invalid URL"
      });
    }

    const code = crypto.randomBytes(4).toString("hex");

    links.set(code, url.href);

    res.json({
      shortUrl: `${req.protocol}://${req.get("host")}/${code}`
    });

  } catch {
    res.status(400).json({
      error: "Please enter a valid URL"
    });
  }
});

app.get("/:code", (req, res) => {
  const destination = links.get(req.params.code);

  if (!destination) {
    return res.status(404).send("Link not found");
  }

  res.redirect(destination);
});

app.get("/", (req, res) => {
  res.send("Linkify Server is Running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Linkify is running!");
});
