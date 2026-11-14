import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import type { Book } from "@/types/book";

const FAVORITES_KEY = "book-finder:favorites";

const App = () => {
  const [favorites, setFavorites] = useState<Book[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (book: Book) => {
    setFavorites((prev) =>
      prev.some((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [...prev, book],
    );
  };

  return (
    <BrowserRouter>
      <AppRoutes
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </BrowserRouter>
  );
};

export default App;
