import type { Book } from "@/types/book";
import Search from "@/components/Search";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { bookService } from "@/services/bookService";
import BookList from "@/components/BookList";

const LIMIT = 20;

interface HomeProps {
    favorites: Book[];
    onToggleFavorite: (book: Book) => void;
}

const Home = ({ favorites, onToggleFavorite }: HomeProps) => {

    //search state
    const [books, setBooks] = useState<Book[]>([]);
    const [total, setTotal] = useState(0);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // trending state
    const [trending, setTrending] = useState<Book[]>([]);
    const [trendingLoading, setTrendingLoading] = useState(true);



    useEffect(() => {
        async function loadTrending() {
            try {
                const result = await bookService.getTrending(10);
                setTrending(result);
            } catch (err) {
                console.log("Could not load trending books", err);
            } finally {
                setTrendingLoading(false);
            }
        }
        loadTrending();
    }, []);


    async function fetchBooks(searchTerm: string, pageNumber: number) {
        setLoading(true);
        setError(null);

        try {
            const result = await bookService.search(searchTerm, pageNumber, LIMIT);
            setBooks(result.books);
            setTotal(result.total);
        } catch {
            setError("Something went wrong while searching. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(searchTerm: string) {
        if (!searchTerm.trim()) return;
        setQuery(searchTerm);
        setPage(1);
        fetchBooks(searchTerm, 1);
    }

    function handlePageChange(newPage: number) {
        setPage(newPage);
        fetchBooks(query, newPage);
    }

    const totalPages = Math.ceil(total / LIMIT);
    const hasSearched = query !== "";



    return (
        <div>
            <Search onSearch={handleSearch} />

            {!hasSearched && (
                <section>
                    <h2 className="px-4 text-2xl font-bold">Trending Today</h2>
                    {trendingLoading && <p className="p-4">Loading trending books...</p>}
                    <BookList
                        books={trending}
                        favorites={favorites}
                        onToggleFavorite={onToggleFavorite}
                    />
                </section>
            )}

            {hasSearched && (
                <section>
                    {loading && <p className="p-4">Searching books...</p>}
                    {error && <p className="p-4 text-red-600">{error}</p>}

                    {!loading && !error && books.length === 0 && (
                        <p className="p-4">No books found for "{query}".</p>
                    )}

                    <BookList
                        books={books}
                        favorites={favorites}
                        onToggleFavorite={onToggleFavorite}
                    />

                    {totalPages > 1 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </section>
            )}
        </div>
    );
};

export default Home;
