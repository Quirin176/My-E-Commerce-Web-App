import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"

export interface SearchBarProps {
    onSuggest?: (query: string) => void;
    suggestions?: string[];
    onSearchSubmit: (query: string) => void;
}

export default function SearchBar({ onSuggest, suggestions = [], onSearchSubmit }: SearchBarProps) {
    const [query, setQuery] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Detect outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!open) return; // skip when closed
        if (!onSuggest) return; // skip when suggestions not needed

        const id = setTimeout(() => {
            if (query.trim() !== "") onSuggest(query);
        }, 400);

        return () => clearTimeout(id);
    }, [query, onSuggest]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearchSubmit(query);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <div className={`flex items-center bg-(--bg-surface) rounded-full gap-4 pl-4 pr-2 py-2
                border-2 ${open ? "border-(--text-primary)" : "border-transparent"}`}>

                {open && <Search className="text-(--text-primary)" size={20} />}

                <div className="flex items-center">
                    <input
                        className="items-center text-lg text-(--text-primary) w-125 focus:outline-none"
                        type="text"
                        placeholder="Search For Products"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onClick={() => setOpen(true)}
                    />

                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="pr-4 text-2xl cursor-pointer"
                        >
                            ✕
                        </button>

                    )}
                </div>

                <button
                    onClick={() => onSearchSubmit(query)}
                    className="rounded-full px-2 py-2 cursor-pointer text-(--text-secondary) hover:text-(--text-primary) bg-(--brand-primary)"
                >
                    <Search size={20} />
                </button>
            </div>

            {open && query !== "" && suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-(--bg-surface) shadow-lg rounded-xl p-2 z-10">
                    {suggestions.map((s) => (
                        <div
                            key={s}
                            className="px-4 py-2 hover:bg-gray-400 cursor-pointer"
                            onClick={() => {
                                setQuery(s);
                                onSearchSubmit(s);
                                setOpen(false);
                            }}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}