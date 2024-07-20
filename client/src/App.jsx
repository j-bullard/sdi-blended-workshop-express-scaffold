import { Route, Routes } from "react-router-dom";
import HomeRoute from "./components/HomeRoute";
import BookDetailsRoute from "./components/BookDetailsRoute";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/books/:id" element={<BookDetailsRoute />} />
      </Routes>
    </>
  );
}
