# Book Finder — React Fundamentals Edition

## 1. Project Goal

Build a simple book-search application to learn React fundamentals using
**TypeScript and TSX from day one**.

This is a learning project, not a production application. The goal is to
understand how React works before rebuilding the complete application
with the RILT stack.

## 2. Technology Stack

-   Vite
-   React 19
-   TypeScript (TSX)
-   Tailwind CSS v4
-   React Router 7
-   Base UI primitives (shadcn-style `Button`, `Card`, `Input`)
-   lucide-react (icons)
-   Open Library API

### Out of scope for v1

-   Laravel or another backend
-   Database
-   Authentication
-   Advanced caching
-   Rate limiting
-   Cross-tab synchronization
-   Complex application architecture

## 3. Features

Keep the first version to four core features, plus a landing feed.

### 3.0 Trending Today

-   Load 10 trending books when the home page opens.
-   Show them only before the user has searched.
-   Fail quietly: if trending can't load, the search box still works.

**Concepts to learn:** `useEffect`, fetching on mount, the empty
dependency array, conditional rendering.

### 3.1 Book Search

-   Search books by title or author.
-   Submit using Enter or the Search button.
-   Fetch results from the Open Library API, 20 per page.
-   Page through results with pagination.
-   Display loading, error and empty-result messages.

**Concepts to learn:** `useState`, event handlers, form submission,
`fetch()`, `async/await`, `response.ok`, and conditional rendering.

### 3.2 Book List

Display search results using reusable book cards in a responsive grid
(1 column on mobile, 2 on small screens, 4 on desktop).

Each card should show:

-   Book cover, or the title's first letter when there's no cover
-   Title (clamped to two lines)
-   Author
-   Publication year
-   Details button
-   Favorite button

**Concepts to learn:** components, props, destructuring, `.map()`,
`key`, conditional rendering, component reuse, and Tailwind responsive
prefixes.

### 3.3 Book Details

Clicking Details opens a dedicated page at `/books/:workId`.

Display:

-   Book cover
-   Title
-   Author
-   First published year
-   Description
-   Subjects (as tags)

The page has its own loading and error states, a favorite button and a
link back to the search page.

> **Changed from the original plan:** details were originally a modal.
> A page gives the content room, is linkable, survives a refresh, and
> costs less code than a modal with its own focus and dismissal
> handling.

**Concepts to learn:** `useParams`, derived routes, `useEffect`
dependencies, `Promise.all`, normalising inconsistent API data, and
component composition.

### 3.4 Favorites

Allow users to add and remove favorite books.

-   Click the bookmark to add a favorite.
-   Click it again to remove the favorite.
-   Show the saved books on a Favorites page.
-   Persist favorites using `localStorage`.
-   Favorites state lives in `App.tsx` so both pages can read it.

**Concepts to learn:** lifting state up, state updates, arrays
(`filter`, `some`, and `find`), the `setState` updater form, `useEffect`,
`localStorage`, and React Router.

## 4. Project Structure

```text
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── BookCard.tsx
│   ├── BookList.tsx
│   ├── Navbar.tsx
│   ├── Pagination.tsx
│   └── Search.tsx
├── layouts/
│   └── AppLayout.tsx
├── pages/
│   ├── Home.tsx
│   ├── Favorites.tsx
│   └── BookDetails.tsx
├── routes/
│   └── AppRoutes.tsx
├── services/
│   └── bookService.ts
├── types/
│   └── book.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 5. React and TypeScript Learning Topics

| Concept | Where it is used |
|---|---|
| Components | `BookCard`, `BookList`, `Pagination`, `Search` |
| Props | Passing book data and favorite callbacks down the tree |
| TypeScript interfaces and types | `Book`, `BookDetails` and every component's props |
| `useState` | Search input, results, pagination, loading, error, favorites |
| `useEffect` | Trending on mount, details by id, persisting favorites |
| Event handling | Search form, pagination, favorite toggle |
| Rendering lists | `.map()` over books and subjects |
| Conditional rendering | Loading, error, empty, trending vs. results |
| React Router | Nested routes, `<Outlet />`, `useParams`, `NavLink` |
| Derived state | `totalPages`, `hasSearched`, `isFavorite` |
| Custom hooks | Optional exercise after understanding regular hooks |

## 6. Learning TypeScript Alongside React

Use TSX from the beginning. Learn TypeScript concepts as they become
useful in the application.

Define the shape of a book:

``` tsx
// types/book.ts

export interface Book {
    id: string;
    title: string;
    authors: string[];
    publishedYear: number | null;
    coverUrl: string | null;
}

export interface BookDetails extends Book {
    description: string | null;
    subjects: string[];
}
```

Use that type to define a component's props:

``` tsx
// components/BookCard.tsx

import type { Book } from "@/types/book";

interface BookCardProps {
    book: Book;
    isFavorite: boolean;
    onToggleFavorite: (book: Book) => void;
}

export default function BookCard({ book, isFavorite, onToggleFavorite }: BookCardProps) {
    return (
        <div>
            <h2>{book.title}</h2>
            <p>{book.authors.join(", ")}</p>
        </div>
    );
}
```

Topics introduced by this example:

-   Interfaces and type annotations
-   Typed component props
-   Destructuring
-   Function props (callbacks)
-   Array methods

Lesson learned the hard way: type the **API response** separately from
your **own** type. Open Library's field names and optional fields are
not yours to keep, so translate once in `bookService`.

Do not try to learn every TypeScript feature before building the app.
Learn what the current task requires.

## 7. Implementation Roadmap

Each milestone should leave the application in a working state.

| Milestone | What to build | Main concepts | Status |
|---|---|---|---|
| M0 | App shell, navbar, routing | React Router, layout with `<Outlet />` | ✅ |
| M1 | Static book card | JSX/TSX, components, props | ✅ |
| M2 | Search input | `useState`, events, forms | ✅ |
| M3 | Open Library integration | `fetch`, `async/await`, `useEffect` | ✅ |
| M4 | Book details page | `useParams`, state, conditional rendering | ✅ |
| M5 | Favorites | Arrays, state updates, `useEffect`, `localStorage` | ✅ |
| M6 | Navigation | React Router, component reuse | ✅ |
| M7 | Trending books | `useEffect` on mount, derived rendering | ✅ |
| M8 | Service layer refactor | Single adapter between API and app types | ✅ |

## 8. Learning Approach

Work through each feature as a series of small exercises:

1.  Understand the React or TypeScript concept.
2.  Understand what the feature needs to do.
3.  Break the feature into a small coding task.
4.  Write the code yourself.
5.  Review the implementation and fix mistakes.
6.  Explain why the code works before moving on.

For example, when learning `useState`, start with a search input:

``` tsx
const [query, setQuery] = useState("");
```

Understand:

-   What is state?
-   What does `useState` return?
-   What does the setter function do?
-   Why does updating state trigger a re-render?
-   How do you connect state to an input?

Then apply those ideas to the book-search feature.

**Learning rule:** Prefer writing the code yourself with guidance over
copying a complete implementation. The goal is to become comfortable
writing React and TypeScript independently.

## 9. Future Version: Complete RILT Application

After completing the React fundamentals version, rebuild Book Finder
using the intended RILT stack.

| Book Finder v1 | Complete version |
|---|---|
| React TSX | React TSX |
| Browser-only application | Laravel-backed application |
| `localStorage` favorites | Database-backed favorites |
| Direct browser API requests | Laravel API or backend integration |
| Simple component state | State management appropriate to the app |
| Basic effects | Reusable custom hooks where useful |
| No authentication | Laravel authentication |
| No backend | Laravel backend |

The purpose of v1 is to understand the React side before adding backend
responsibilities and more advanced architecture.

## 10. Definition of Done

Book Finder v1 is complete when:

-   [x] A user can search for books by title or author.
-   [x] Search results appear as reusable book cards.
-   [x] Loading, error, and empty states are handled.
-   [x] A user can open a book's details.
-   [x] A user can add and remove favorites.
-   [x] Favorites remain saved after refreshing the page.
-   [x] A user can navigate between Home, Favorites and Details.
-   [x] Components and props are typed with TypeScript.
-   [ ] The developer can explain the hooks and React concepts used in
    the app without notes.
-   [ ] There is at least one automated test.

------------------------------------------------------------------------

**Guiding principle:** Keep v1 small. Focus on understanding components,
props, state, effects, events, and TypeScript. Add advanced features
only after the fundamentals make sense.
