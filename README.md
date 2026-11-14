# Book Finder

A small book discovery app built with React, TypeScript and the [Open Library](https://openlibrary.org/developers/api) API. Search any title, browse what's trending today, read a book's details, and keep a list of favorites that survives a page refresh.

No backend, no database, no API key — just a browser talking to a public API.

This is a learning project. It exists to get comfortable with React fundamentals (components, props, state, effects, routing) and TypeScript before rebuilding the same app with a real backend.

## Features

- **Search** books by title or author, 20 per page, with pagination
- **Trending Today** on the home page, loaded when the app starts
- **Details page** for any book — cover, authors, first published year, description and subjects
- **Favorites** — add or remove with the bookmark button, visible on a dedicated page
- **Persistent favorites** — stored in `localStorage`, so they survive a refresh
- **Responsive layout** — one column on a phone, four on a wide screen
- **Honest states** — loading, error and empty results are all handled

## Tech stack

| Tool | Why |
|---|---|
| [Vite](https://vite.dev) | Dev server and build |
| [React 19](https://react.dev) | UI |
| TypeScript | Typed props and API shapes |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [React Router 7](https://reactrouter.com) | Home, Favorites and Details pages |
| [Base UI](https://base-ui.com) + shadcn-style components | Accessible buttons, cards, inputs |
| [lucide-react](https://lucide.dev) | Icons |
| [Open Library API](https://openlibrary.org/developers/api) | All book data |

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

```bash
npm run build    # type-check + production build
npm run preview  # serve the production build
npm run lint     # eslint
```

## Project structure

```text
src/
├── components/
│   ├── ui/            # reusable primitives (Button, Card, Input)
│   ├── BookCard.tsx   # one book: cover, title, author, year, actions
│   ├── BookList.tsx   # responsive grid of BookCards
│   ├── Navbar.tsx
│   ├── Pagination.tsx
│   └── Search.tsx     # controlled search form
├── layouts/
│   └── AppLayout.tsx  # navbar + <Outlet /> + footer
├── pages/
│   ├── Home.tsx       # search + trending
│   ├── Favorites.tsx  # saved books
│   └── BookDetails.tsx
├── routes/
│   └── AppRoutes.tsx  # route table
├── services/
│   └── bookService.ts # everything that talks to Open Library
├── types/
│   └── book.ts
├── App.tsx            # owns the favorites state
└── main.tsx
```

## How it works

**`bookService` is the only place that knows about Open Library.** The API and the app speak different languages: the API calls it `cover_i` and `first_publish_year`, the app calls it `coverUrl` and `publishedYear`. A private `toBook()` method translates one into the other, so components only ever see the `Book` type. Swapping the API later means editing one file.

**Favorites live in `App.tsx`, not in a page.** State must sit above every component that needs it. When favorites lived inside `Home`, the Favorites page couldn't see them — `Home` unmounts the moment you navigate away. Lifting the state up and passing it down through `AppRoutes` fixed that.

**The details route takes only the work id.** A book's id is `/works/OL17930368W` — slashes and all. Putting that straight in a URL would need `%2F` encoding, which some static hosts reject, so the link uses the last segment (`OL17930368W`) and the service rebuilds the full path.

**Two requests power the details page.** `/works/{id}.json` has the description and subjects but *no author names*; the search-by-key call has the authors. They run in parallel with `Promise.all`, so the page is no slower than one request.

## What I learned

Written from the perspective of building this, milestone by milestone.

**Components are just functions that return markup.** Writing `BookCard` once and rendering it with `.map()` taught me the difference between "a thing" and "a list of things" — and that `key` needs to be stable, which is why `book.id` works and the array index doesn't.

**Props go one way, down.** Typing them with an `interface` caught real mistakes: passing a `Book` where a `string` was expected stopped at compile time instead of at runtime, in the browser, hours later.

**State has to live above the components that share it.** This was the biggest lesson. My favorites started as `useState` inside `Home`. Everything worked on the home page — and the Favorites page was always empty, because navigating unmounted `Home` and threw its state away. Lifting it to `App` and passing it down through the router fixed it. The mental model that finally clicked: state belongs at the lowest common parent of everyone who needs it.

**`useEffect` is for syncing with the outside world.** Fetching on mount with an empty dependency array, re-fetching when `workId` changes — that's the whole pattern. The `[]` isn't decoration; it decides *when* it runs.

**Async work has three states, not one.** Not just "done" — also "still loading" and "failed". My first version only rendered data, so a failed request showed a blank page and a console log nobody would ever read. Loading, error and empty are all part of the UI.

**`fetch` lies to you.** It doesn't throw on a 404 or a 500 — it resolves with `ok: false`. You have to check `response.ok` yourself, which is why every request now goes through one `request()` helper.

**`filter` returns an array, and every array is truthy.** My toggle did `favorites.filter((b) => b.id === b.id)` and then `if (isFavorite)`. Two bugs in two characters: comparing an id to itself always matches, and an empty array is still `true`, so the remove branch *always* ran and nothing was ever saved. `some()` was the right tool — it answers a yes/no question. Knowing which array method answers which question (`map` transforms, `filter` removes, `some` asks, `find` picks one) is most of list logic.

**The API's shape is not your shape.** Open Library returns whatever it wants, including fields that are sometimes a string and sometimes `{ type, value }` (book descriptions). Typing that honestly, then normalising it once at the boundary, keeps that mess out of the components.

**The updater form of `setState` exists for a reason.** `setFavorites([...favorites, book])` reads the render's snapshot. `setFavorites((prev) => [...prev, book])` always reads the latest. Two clicks in the same tick is all it takes to lose one.

**Routing is just URLs mapped to components.** Nested routes with `<Outlet />` is what lets the navbar stay put while the page swaps. `NavLink` gives you the active state for free.

**TypeScript earns its keep at the boundaries.** Understanding that interfaces describe *external* data, not just internal objects, is what made the service layer feel natural instead of ceremonial.

**Small things that turn out to matter:** a controlled input needs both `value` and `onChange`; a form needs `e.preventDefault()`; `line-clamp` stops long titles breaking a grid; `sm:` and `md:` prefixes mean one layout works on a phone and a laptop; and `array.pop()` is sometimes the difference between a route that works on a static host and one that 404s.

## Known limits

- Favorites are stored per browser, not per account. Clearing site data clears them.
- Data comes live from Open Library, so it's as fast (and as flaky) as a third-party API.
- No tests yet.
- Details pages show description and subjects only — page count and publisher live on a per-edition endpoint and cost another request.
- No caching, so revisiting a book re-fetches it.

## What's next

Rebuild the same app against a Laravel backend: real accounts, database-backed favorites, and a server that owns the API calls instead of the browser.
