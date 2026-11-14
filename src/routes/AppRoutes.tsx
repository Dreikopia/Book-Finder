import { Routes, Route } from "react-router-dom";
import type { Book } from "@/types/book";
import AppLayout from "@/layouts/AppLayout";
import Home from "@/pages/Home";
import Favorites from "@/pages/Favorites";
import BookDetailsPage from "@/pages/BookDetails";

interface AppRoutesProps {
    favorites: Book[];
    onToggleFavorite: (book: Book) => void;
}

export default function AppRoutes({
    favorites,
    onToggleFavorite,
}: AppRoutesProps) {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route
                    path="/"
                    element={
                        <Home favorites={favorites} onToggleFavorite={onToggleFavorite} />
                    }
                />
                <Route
                    path="/favorites"
                    element={
                        <Favorites favorites={favorites} onToggleFavorite={onToggleFavorite} />
                    }
                />
                <Route
                    path="/books/:workId"
                    element={
                        <BookDetailsPage favorites={favorites} onToggleFavorite={onToggleFavorite} />
                    }
                />
            </Route>
        </Routes>
    );
}
