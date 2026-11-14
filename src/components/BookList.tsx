import type { Book } from "@/types/book";
import BookCard from "@/components/BookCard";

interface BookListProps {
    books: Book[];
    favorites: Book[];
    onToggleFavorite: (book: Book) => void;
}

export default function BookList({ books, favorites, onToggleFavorite }: BookListProps) {
    return (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-4">
            {books.map((book) => (
                <BookCard
                    key={book.id}
                    book={book}
                    isFavorite={favorites.some((b) => b.id === book.id)}
                    onToggleFavorite={onToggleFavorite} />
            ))}
        </div>
    );
}