import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import type { Book } from "@/types/book";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface BookCardProps {
    book: Book;
    isFavorite: boolean;
    onToggleFavorite: (book: Book) => void;
}

export default function BookCard({ book, isFavorite, onToggleFavorite }: BookCardProps) {
    const workId = book.id.split("/").pop();

    return (
        <Card className="flex flex-col overflow-hidden">
            <CardHeader className="p-4">
                <div className="flex h-64 items-center justify-center">
                    {book.coverUrl ? (
                        <img
                            src={book.coverUrl}
                            alt={`Cover of ${book.title}`}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-5xl font-bold text-muted-foreground">
                            {book.title.charAt(0)}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-2">
                <CardTitle className="line-clamp-2">
                    {book.title}
                </CardTitle>

                <CardDescription className="line-clamp-1">
                    {book.authors.join(", ") || "Unknown author"}
                </CardDescription>

                <p className="text-sm text-muted-foreground">
                    Published: {book.publishedYear ?? "Unknown"}
                </p>
            </CardContent>

            <CardFooter className="flex justify-between gap-2">
                <Link
                    to={`/books/${workId}`}
                    className={buttonVariants({ className: "flex-1" })}
                >
                    Details
                </Link>

                <Button
                    onClick={() => onToggleFavorite(book)}
                    variant="ghost"
                    size="icon"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <Bookmark className={isFavorite ? "fill-current" : undefined} />
                </Button>
            </CardFooter>
        </Card>
    );
}
