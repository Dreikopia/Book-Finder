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
