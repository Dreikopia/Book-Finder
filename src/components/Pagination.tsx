import { Button } from "./ui/button";


interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-4 p-4">
            <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </Button>
            <span className="text-sm">
                Page {page} of {totalPages}
            </span>

            <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </Button>
        </div>
    );
}