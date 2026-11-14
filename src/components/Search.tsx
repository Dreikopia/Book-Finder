import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface searchProps {
    onSearch: (searchTerm: string) => void;
}

export default function Search({ onSearch }: searchProps) {
    const [searchTerm, setSearchTerm] = useState("");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        onSearch(searchTerm);
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
                <Input
                    type="text"
                    placeholder="Title or Author"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-950"
                />

                <Button type="submit">
                    Search
                </Button>
            </form>
        </div>
    );
}