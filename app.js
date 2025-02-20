const express = require("express");
const cookieParser = require("cookie-parser");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const fs = require("node:fs");
const path = require("node:path");
const cors = require("cors");

const app = express();

const DUMMY_DATA_PATH = path.join(process.cwd(), "dummy.csv");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// middleware to track book id requests
const bookCookieTracker = (req, res, next) => {
  if (req.method === "GET" || req.method === "POST") {
    // get the book id from the request url
    const bookId = req.params.id || req.body.id;
    if (bookId) {
      let tracker = req.cookies.tracker ? JSON.parse(req.cookies.tracker) : [];
      if (!tracker.includes(bookId)) {
        tracker.unshift(bookId);
      }

      // store the first 10 book ids in the cookie
      res.cookie("tracker", JSON.stringify(tracker.slice(0, 3)), {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      });
    }
  }

  next();
};

app.get("/books", (req, res) => {
  const allBooks = [];

  const csvData = fs.readFileSync(DUMMY_DATA_PATH, "utf8");
  const dummyBooks = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  for (let i = 0; i < dummyBooks.length; i++) {
    const bookId = dummyBooks[i].id;
    const bookPath = path.join(process.cwd(), "data", `${bookId}.csv`);
    const bookData = fs.readFileSync(bookPath, "utf8");
    const singleBookArr = parse(bookData, {
      columns: true,
      skip_empty_lines: false,
    });
    allBooks.push({
      ...dummyBooks[i],
      genres: singleBookArr[0].genres.split(", "),
      synopsis: singleBookArr[0].synopsis,
    });
  }

  if (!req.query.genres) {
    return res.status(200).json({ books: allBooks });
  }

  const genres = req.query.genres ? req.query.genres.split(", ") : [];
  const filteredBooks = allBooks.filter((book) =>
    book.genres.some((genre) => genres.includes(genre)),
  );

  // for (let i = 0; i < dummyBooks.length; i++) {
  //   const bookId = dummyBooks[i].id;
  //   const bookPath = path.join(process.cwd(), "data", `${bookId}.csv`);
  //   const bookData = fs.readFileSync(bookPath, "utf8");
  //   const singleBookArr = parse(bookData, {
  //     columns: true,
  //     skip_empty_lines: false,
  //   });

  //   if (
  //     singleBookArr[0].genres
  //       .split(", ")
  //       .some((genre) => genres.includes(genre))
  //   ) {
  //     filteredBooks.push({
  //       ...dummyBooks[i],
  //       genres: singleBookArr[0].genres.split(", "),
  //       synopsis: singleBookArr[0].synopsis,
  //     });
  //   }
  // }

  res.status(200).json({ books: filteredBooks });
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
    path.join(process.cwd(), "data", `${nextId}.csv`),
    stringy2,
    "utf8",
  );

  res.status(200).json({ book: { id: nextId, title, author, cover } });
});

app.get("/books/:id", bookCookieTracker, (req, res) => {
  const { id } = req.params;
  const csvData = fs.readFileSync(
    path.join(process.cwd(), "data", `${id}.csv`),
    "utf8",
  );
  const book = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
  });

  res.status(200).json({
    book: {
      ...book[0],
      genres: book[0].genres.split(", "),
    },
  });
});

app.patch("/books/:id", bookCookieTracker, (req, res) => {
  const id = req.params.id;
  const { title, author, cover, genres, synopsis } = req.body;

  // Read data/[id].csv
  const csvData = fs.readFileSync(
    path.join(process.cwd(), "data", `${id}.csv`),
    "utf8",
  );
  const books = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
  });

  const book = books[0];
  book.title = title || book.title;
  book.author = author || book.author;
  book.genres = genres?.join(", ") || book.genres;
  book.synopsis = synopsis || book.synopsis;

  const stringBook = stringify([book], { quoted: true, header: true });

  fs.writeFileSync(
    path.join(process.cwd(), "data", `${id}.csv`),
    stringBook,
    "utf8",
  );

  // Read dummy.csv
  const dummyCsvData = fs.readFileSync(DUMMY_DATA_PATH, "utf8");
  const dummyBooks = parse(dummyCsvData, {
    columns: true,
    skip_empty_lines: false,
  });

  const dummyBookIndex = dummyBooks.findIndex((b) => b.id === id);
  const dummyBook = dummyBooks[dummyBookIndex];
  dummyBook.title = title || dummyBook.title;
  dummyBook.author = author || dummyBook.author;
  dummyBook.cover = cover || dummyBook.cover;

  dummyBooks[dummyBookIndex] = dummyBook;

  const stringDummyBooks = stringify(dummyBooks, {
    quoted: true,
    header: true,
  });

  fs.writeFileSync(DUMMY_DATA_PATH, stringDummyBooks, "utf8");

  res.status(200).json({
    book: {
      ...dummyBook,
      genres: book.genres.split(", "),
      synopsis: book.synopsis,
    },
  });
});

app.delete("/books/:id", (req, res) => {
  const id = req.params.id;

  ///.csv data file
  fs.unlink(path.join(process.cwd(), "data", `${id}.csv`));

  ///Dummy.csv
  const dummyCsvData = fs.readFileSync(DUMMY_DATA_PATH, "utf8");
  const dummyBooks = parse(dummyCsvData, {
    columns: true,
    skip_empty_lines: false,
  });

  const dummyBookIndex = dummyBooks.findIndex((b) => b.id === id);
  dummyBooks.splice(dummyBookIndex, 1);

  const stringDummyBooks = stringify(dummyBooks, {
    quoted: true,
    header: true,
  });

  fs.writeFileSync(DUMMY_DATA_PATH, stringDummyBooks, "utf8");

  res.status(200).send("Book deleted successfully");
});

app.get("/recent", (req, res) => {
  let tracker = req.cookies.tracker ? JSON.parse(req.cookies.tracker) : [];
  if (!tracker) {
    return res.status(200).json({ books: [] });
  }

  const allBooks = [];

  const csvData = fs.readFileSync(DUMMY_DATA_PATH, "utf8");
  const dummyBooks = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  for (let i = 0; i < dummyBooks.length; i++) {
    const bookId = dummyBooks[i].id;

    if (tracker.includes(bookId.toString())) {
      const bookPath = path.join(process.cwd(), "data", `${bookId}.csv`);
      const bookData = fs.readFileSync(bookPath, "utf8");
      const singleBookArr = parse(bookData, {
        columns: true,
        skip_empty_lines: false,
      });

      allBooks.push({
        ...dummyBooks[i],
        genres: singleBookArr[0].genres.split(", "),
        synopsis: singleBookArr[0].synopsis,
      });
    }
  }

  return res.status(200).json({ books: allBooks });
});

module.exports = app;
