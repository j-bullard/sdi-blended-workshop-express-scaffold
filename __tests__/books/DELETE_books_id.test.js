const request = require("supertest");
const app = require("../../app");
const fs = require("node:fs");
const path = require("node:path");

jest.mock("node:fs");

describe("DELETE /books/:id", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should delete the book with the specified id", (done) => {
    fs.readFileSync.mockReturnValue(
      '"id","title","author","cover",\n' +
        '"1","1984","George Orwell","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg",\n' +
        '"2","Harry Potter and the Sorcerer\'s Stone","JK Rowling","Fantasy, Fiction, Young Adult","Harry Potter has no idea how famous he is."\n',
    );

    request(app)
      .delete("/books/2")
      .expect(200, "Book deleted successfully")
      .expect(() => {
        expect(fs.unlink).toHaveBeenCalledWith(
          path.join(process.cwd(), "data", "2.csv"),
        );

        expect(fs.readFileSync).toHaveBeenCalledWith(
          path.join(process.cwd(), "dummy.csv"),
          "utf8",
        );

        expect(fs.writeFileSync).toHaveBeenCalledWith(
          path.join(process.cwd(), "dummy.csv"),
          '"id","title","author","cover",\n' +
            '"1","1984","George Orwell","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg",\n',
          "utf8",
        );
      })
      .end((err) => {
        if (err) throw err;
        done();
      });
  });
});
