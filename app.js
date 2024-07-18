const express = require("express");
const cookieParser = require("cookie-parser");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const fs = require("node:fs");
const path = require("node:path");

const app = express();

app.use(express.json());
app.use(cookieParser());

const DUMMY_DATA_PATH = path.join(__dirname, "dummy.csv");

app.get("/books", (_, res) => {
  const csvData = fs.readFileSync(DUMMY_DATA_PATH, "utf8");
  const books = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  res.status(200).json({ books });
});

app.post("/books", (req, res) => {
  const { title, author, cover, genres, synopsis } = req.body;
  const csvData = fs.readFileSync(DUMMY_DATA_PATH, "utf8");
  const nextId = csvData.split("\n").length;

  const stringy1 = stringify([{ id: nextId, title, author, cover }], {
    quoted: true,
  });
  const stringy2 = stringify(
    [{ id: nextId, title, author, genres: genres.join(", "), synopsis }],
    { quoted: true, header: true },
  );

  fs.appendFileSync(DUMMY_DATA_PATH, stringy1, "utf8");

  fs.writeFileSync(
    path.join(__dirname, "data", `${nextId}.csv`),
    stringy2,
    "utf8",
  );

  res.status(200).json({ book: { id: nextId, title, author, cover } });
});

module.exports = app;
