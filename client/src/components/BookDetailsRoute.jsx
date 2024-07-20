import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookDetailsRoute() {
  const [book, setBook] = useState();
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchBookDetails = async () => {
      let result, error;

      try {
        const response = await fetch(`http://localhost:8080/books/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Fetch failed");
        }
        result = await response.json();
      } catch (err) {
        error = err instanceof Error ? err.message : "An error occurred";
      }
      return { result, error };
    };

    fetchBookDetails().then(({ result, error }) => {
      if (error) {
        console.error(error);
        return;
      }
      setBook(result.book);
      setLoading(false);
    });
  }, [id]);

  return (
    <>
      <h2>Book Details</h2>
      {loading && <p>Loading...</p>}
      {!loading && !book && <p>Book not found</p>}
      {book && (
        <div>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.synopsis}</p>
          <p>Genres: {book.genres.join(", ")}</p>
          <img
            src={book.cover}
            alt={book.title}
            style={{ maxWidth: "200px" }}
          />
        </div>
      )}
    </>
  );
}
