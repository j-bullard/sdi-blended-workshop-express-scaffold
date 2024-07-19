const request = require("supertest");
const app = require("./app");
const fs = require("node:fs");
const path = require("node:path");

jest.mock("node:fs");

describe("/books/:id", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("GET /books/:id", () => {
    test("should return data for the specific book from the data directory using the book's id", (done) => {
      fs.readFileSync.mockReturnValue(
        '"id","title","author","genres","synopsis"\n"2","Harry Potter and the Sorcerer\'s Stone","JK Rowling","Fantasy, Fiction, Young Adult","Harry Potter has no idea how famous he is."',
      );

      request(app)
        .get("/books/2")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.book.id).toBe(2);
          expect(res.body.book.title).toBe(
            "Harry Potter and the Sorcerer's Stone",
          );
          expect(res.body.book.author).toBe("JK Rowling");
          expect(res.body.book.genres).toEqual([
            "Fantasy",
            "Fiction",
            "Young Adult",
          ]);
          expect(res.body.book.synopsis).toBe(
            "Harry Potter has no idea how famous he is.",
          );
        })
        .expect(() => {
          expect(fs.readFileSync).toHaveBeenCalledTimes(1);
          expect(fs.readFileSync).toHaveBeenCalledWith(
            path.join(__dirname, "data", "2.csv"),
            "utf8",
          );
        })
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe("PATCH /books/:id", () => {
    test("Should update inputted data to [id].csv file", (done) => {
      fs.readFileSync.mockImplementation((filepath) => {
        if (filepath === path.join(__dirname, "data", "2.csv")) {
          return '"id","title","author","genres","synopsis"\n"2","Harry Potter and the Sorcerer\'s Stone","JK Rowling","Fantasy, Fiction, Young Adult","Harry Potter has no idea how famous he is."';
        }

        if (filepath === path.join(__dirname, "dummy.csv")) {
          return '"id","title","author","cover"\n"1","1984","George Orwell","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg"\n"2","Harry Potter and the Sorcerer\'s Stone","JK Rowling","https://m.media-amazon.com/images/I/71-++hbbERL._AC_SY300_SX300_.jpg"';
        }

        return null;
      });

      request(app)
        .patch("/books/2")
        .send({
          title: "Harry Potter and the Chamber of Secrets",
          synopsis:
            "The summer after his first year at Hogwarts is worse than ever for Harry Potter. The Dursleys of Privet Drive are more horrible to him than e",
          cover:
            "https://m.media-amazon.com/images/I/71MUiF4iVzL._AC_UF894,1000_QL80_.jpg",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.book.title).toBe(
            "Harry Potter and the Chamber of Secrets",
          );
          expect(res.body.book.synopsis).toBe(
            "The summer after his first year at Hogwarts is worse than ever for Harry Potter. The Dursleys of Privet Drive are more horrible to him than e",
          );
        })
        .expect(() => {
          // Check if the new data is written to the data/id.csv file
          expect(fs.writeFileSync).toHaveBeenNthCalledWith(
            1,
            path.join(__dirname, "data", "2.csv"),
            '"id","title","author","genres","synopsis"\n"2","Harry Potter and the Chamber of Secrets","JK Rowling","Fantasy, Fiction, Young Adult","The summer after his first year at Hogwarts is worse than ever for Harry Potter. The Dursleys of Privet Drive are more horrible to him than e"\n',
            "utf8",
          );

          // Check if the new data is written to the dummy.csv file
          expect(fs.writeFileSync).toHaveBeenNthCalledWith(
            2,
            path.join(__dirname, "dummy.csv"),
            '"id","title","author","cover"\n"1","1984","George Orwell","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg"\n"2","Harry Potter and the Chamber of Secrets","JK Rowling","https://m.media-amazon.com/images/I/71MUiF4iVzL._AC_UF894,1000_QL80_.jpg"\n',
            "utf8",
          );
        })
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  // describe("DELETE /books/:id", () => {});
});

describe("/books/:id", () => {});
