const request = require("supertest");
const app = require("../../app");
const fs = require("node:fs");
const path = require("node:path");

jest.mock("node:fs");

describe("GET /books/:id", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  test("should return data for the specific book from the data directory using the book's id", (done) => {
    fs.readFileSync.mockReturnValue(
      '"id","title","author","genres","synopsis"\n' +
        '"2","Harry Potter and the Sorcerer\'s Stone","JK Rowling","Fantasy, Fiction, Young Adult","Harry Potter has no idea how famous he is."',
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
          path.join(process.cwd, "data", "2.csv"),
          "utf8",
        );
      })
      .end((err) => {
        if (err) throw err;
        done();
      });
  });
});
