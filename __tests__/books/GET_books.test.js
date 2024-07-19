const request = require("supertest");
const app = require("../../app");
const fs = require("node:fs");
const path = require("node:path");

jest.mock("node:fs");

describe("GET /books", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should return a JSON object of filtered books", (done) => {
    fs.readFileSync.mockImplementation((filepath) => {
      if (filepath === path.join(process.cwd(), "data", "1.csv")) {
        return (
          '"id","title","author","genres","synopsis"\n' +
          '"1","1984","George Orwell","Classics, Fiction, Science Fiction, Dystopia","Among the seminal texts of the 20th century"'
        );
      }

      if (filepath === path.join(process.cwd(), "data", "2.csv")) {
        return (
          '"id","title","author","genres","synopsis"\n' +
          '"2","Harry Potter and the Sorcerer\'s Stone","JK Rowling","Fantasy, Fiction, Young Adult","Harry Potter has no idea how famous he is."'
        );
      }

      if (filepath === path.join(process.cwd(), "dummy.csv")) {
        return (
          '"id","title","author","cover"\n' +
          '"1","1984","George Orwell","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg"\n' +
          '"2","Harry Potter and the Sorcerer\'s Stone","JK Rowling","https://m.media-amazon.com/images/I/71-++hbbERL._AC_SY300_SX300_.jpg"'
        );
      }

      return null;
    });

    request(app)
      .get("/books")
      .query({ genres: "Classics" })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const [book1] = res.body.books;
        expect(book1.id).toBe("1");
        expect(book1.title).toBe("1984");
        expect(book1.author).toBe("George Orwell");
        expect(book1.cover).toBe(
          "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg",
        );
        expect(book1.genres).toEqual([
          "Classics",
          "Fiction",
          "Science Fiction",
          "Dystopia",
        ]);
        expect(book1.synopsis).toBe(
          "Among the seminal texts of the 20th century",
        );
      })
      .end((err) => {
        if (err) throw err;
        done();
      });
  });

  test("should return a JSON object of all the books", (done) => {
    // Mock the parse function
    fs.readFileSync.mockReturnValue(
      '"id","title","author","cover"\n' +
        '"1","1984","George Orwell","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg"\n' +
        '"2","Crime and Punishment","Fyodor Dostoevsky","https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg"',
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
      .end((err) => {
        if (err) throw err;
        done();
      });
  });
});
