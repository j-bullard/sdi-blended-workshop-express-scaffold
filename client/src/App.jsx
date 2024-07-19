import { useState, useEffect } from "react";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookFetch = async () => {
      let result, error;

      try {
        const response = await fetch("http://localhost:8080/books");
        if (!response.ok) {
          throw new Error("Fetch failed");
        }
        result = await response.json();
      } catch (err) {
        error = err instanceof Error ? err.message : "An error occurred";
      }
      return { result, error };
    };

    bookFetch().then(({ result, error }) => {
      if (error) {
        console.error(error);
        return;
      }
      setBooks(result.books);
    });
    setLoading(false);
  }, []);

  return (
    <>
      <h1>Book Nook</h1>
      <h2>Books</h2>
      {loading && <p>Loading...</p>}
      {books.length === 0 && !loading && <p>No books found</p>}
      {books.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Author</th>
              <th>Genres</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <img
                    src={book.cover}
                    alt={book.title}
                    style={{ maxWidth: "80px" }}
                  />
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genres.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
