const request = require("supertest");
const app = require("./app");
const fs = require("node:fs");

jest.mock("node:fs");

describe("GET /books", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("should return a JSON object of all the books", (done) => {
    // Mock the parse function
    fs.readFileSync.mockReturnValue(
      '"id","title","author","cover"\n"1","1984","George Orwell","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg"\n"2","Crime and Punishment","Fyodor Dostoevsky","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg"',
    );

    request(app)
      .get("/books")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.books.length).toBe(2);

        const [book1, book2] = res.body.books;
        expect(book1.id).toBe("1");
        expect(book1.title).toBe("1984");
        expect(book1.author).toBe("George Orwell");
        expect(book1.cover).toBe(
          "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg",
        );

        expect(book2.id).toBe("2");
        expect(book2.title).toBe("Crime and Punishment");
        expect(book2.author).toBe("Fyodor Dostoevsky");
        expect(book2.cover).toBe(
          "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg",
        );
      })
      .end((err, _) => {
        if (err) done(err);
        done();
      });
  });
});

describe("POST /books", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("should read data and insert new data into dummy.csv file and create a new .csv file in /data", (done) => {
    fs.readFileSync.mockReturnValue(
      '"id","title","author","cover"\n"1","1984","George Orwell","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg"',
    );

    request(app)
      .post("/books")
      .send({
        title: "Harry Potter",
        author: "JK Rowling",
        cover:
          "https://m.media-amazon.com/images/I/71-++hbbERL._AC_SY300_SX300_.jpg",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.book.id).toBe(2);
        expect(res.body.book.title).toBe("Harry Potter");
        expect(res.body.book.author).toBe("JK Rowling");
        expect(res.body.book.cover).toBe(
          "https://m.media-amazon.com/images/I/71-++hbbERL._AC_SY300_SX300_.jpg",
        );
      })
      .end((err) => {
        if (err) throw err;
        done();
      });
  });
});
