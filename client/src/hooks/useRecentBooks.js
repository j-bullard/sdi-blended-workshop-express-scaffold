import { useEffect, useState } from "react";

export function useRecentBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBooks = async () => {
      let result, error;

      try {
        const response = await fetch("http://localhost:8080/recent", {
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

    fetchRecentBooks().then(({ result, error }) => {
      if (error) {
        console.error(error);
        return;
      }
      setBooks(result.books);
    });
    setLoading(false);
  }, []);

  return { recentBooks: books, loading };
}
