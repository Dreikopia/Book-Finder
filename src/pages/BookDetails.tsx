import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bookmark } from "lucide-react";
import type { Book, BookDetails } from "@/types/book";
import { bookService } from "@/services/bookService";
import { Button } from "@/components/ui/button";

interface BookDetailsPageProps {
    favorites: Book[];
    onToggleFavorite: (book: Book) => void;
}

export default function BookDetailsPage({ favorites, onToggleFavorite }: BookDetailsPageProps) {
    const { workId = "" } = useParams();
    const [book, setBook] = useState<BookDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);

            try {
                setBook(await bookService.getDetails(workId));
            } catch {
                setError("Could not load this book. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [workId]);

    if (loading) return <p className="p-4">Loading book...</p>;
    if (!book) return <p className="p-4 text-red-600">{error ?? "Book not found."}</p>;

    const isFavorite = favorites.some((b) => b.id === book.id);

    return (
        <article className="mx-auto max-w-3xl p-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to books
            </Link>

            <div className="mt-4 flex flex-col gap-6 sm:flex-row">
                {book.coverUrl ? (
                    <img
                        src={book.coverUrl}
                        alt={`Cover of ${book.title}`}
                        className="h-80 w-56 shrink-0 rounded-md bg-muted object-contain"
                    />
                ) : (
                    <div className="flex h-80 w-56 shrink-0 items-center justify-center rounded-md bg-muted text-6xl font-bold text-muted-foreground">
                        {book.title.charAt(0)}
                    </div>
                )}

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold">{book.title}</h1>
                    <p className="text-muted-foreground">
                        {book.authors.join(", ") || "Unknown author"}
                    </p>
                    <p className="text-sm">
                        First published: {book.publishedYear ?? "Unknown"}
                    </p>

                    <Button
                        variant={isFavorite ? "default" : "outline"}
                        onClick={() => onToggleFavorite(book)}
                    >
                        <Bookmark className={isFavorite ? "fill-current" : undefined} />
                        {isFavorite ? "Favorited" : "Add to favorites"}
                    </Button>
                </div>
            </div>

            <h2 className="mt-8 text-xl font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">
                {book.description ?? "No description available."}
            </p>

            {book.subjects.length > 0 && (
                <>
                    <h2 className="mt-8 text-xl font-semibold">Subjects</h2>
                    <ul className="mt-2 flex flex-wrap gap-2">
                        {book.subjects.slice(0, 12).map((subject) => (
                            <li key={subject} className="rounded-full bg-muted px-3 py-1 text-xs">
                                {subject}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </article>
    );
}
