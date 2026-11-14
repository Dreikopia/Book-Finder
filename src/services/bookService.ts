import type { Book, BookDetails } from "@/types/book";


const BASE_URL = "https://openlibrary.org";
const COVER_URL = "https://covers.openlibrary.org/b/id";

interface OpenLibraryBook { //describe what open library sends
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    subject?: string[];
}

interface SearchResponse { //describes the complete search response 
    numFound: number;
    docs: OpenLibraryBook[];
}

interface TrendingResponse { // describes the complete trending response.
    works: OpenLibraryBook[];
}

interface WorkDetails { // the /works/{id}.json response
    key: string;
    title: string;
    description?: string | { value: string };
    subjects?: string[];
    covers?: number[];
}

export interface SearchResult { //
    books: Book[];
    total: number;
}

class BookService {

    async search(query: string, page: number, limit: number): Promise<SearchResult> {
        const url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
        const data = await this.request<SearchResponse>(url);

        return {
            books: data.docs.map((doc) => this.toBook(doc)),
            total: data.numFound,
        };
    }

    async getTrending(limit: number = 10): Promise<Book[]> {
        const url = `${BASE_URL}/trending/daily.json?limit=${limit}`;
        const data = await this.request<TrendingResponse>(url);

        return data.works.map((work) => this.toBook(work));
    }

    // /works/{id}.json has no author names, so the search-by-key call supplies them
    async getDetails(workId: string): Promise<BookDetails> {
        const query = encodeURIComponent(`"/works/${workId}"`);

        const [work, match] = await Promise.all([
            this.request<WorkDetails>(`${BASE_URL}/works/${workId}.json`),
            this.request<SearchResponse>(
                `${BASE_URL}/search.json?q=key:${query}&fields=key,title,author_name,first_publish_year,cover_i&limit=1`,
            ),
        ]);

        const book = this.toBook(match.docs[0] ?? work);

        return {
            ...book,
            id: work.key,
            title: work.title,
            coverUrl: book.coverUrl ??
                (work.covers?.[0] ? `${COVER_URL}/${work.covers[0]}-L.jpg` : null),
            description: typeof work.description === "string"
                ? work.description
                : work.description?.value ?? null,
            subjects: work.subjects ?? [],
        };
    }

    // Shared helper: fetch + check for errors + return JSON
    private async request<T>(url: string): Promise<T> {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response.json() as Promise<T>;
    }

    private toBook(item: OpenLibraryBook): Book {
        return {
            id: item.key,
            title: item.title,
            authors: item.author_name ?? [],
            publishedYear: item.first_publish_year ?? null,
            coverUrl: item.cover_i ? `${COVER_URL}/${item.cover_i}-M.jpg` : null,
        };
    }
}

export const bookService = new BookService();
