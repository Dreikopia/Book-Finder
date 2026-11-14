import type { Book } from "@/types/book";
import BookList from "@/components/BookList";

interface FavoritesProps {
    favorites: Book[];
    onToggleFavorite: (book: Book) => void;
}

export default function Favorites({ favorites, onToggleFavorite }: FavoritesProps) {
    if (favorites.length === 0) {
        return <p className="p-4">No favorites yet — tap the bookmark on any book.</p>;
    }

    return (
        <section>
            <h2 className="px-4 text-2xl font-bold">Your Favorites</h2>
            <BookList
                books={favorites}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
            />
        </section>
    );
}
