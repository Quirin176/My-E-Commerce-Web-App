import { useState, useRef, useEffect } from "react";
import { Monitor, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import type { ThemeMode } from "../context/ThemeContext";

// ─── Config ───────────────────────────────────────────────────────────────────

const OPTIONS: { value: ThemeMode; label: string; Icon: React.ElementType }[] = [
    { value: "system", label: "System", Icon: Monitor },
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ThemeToggle() {
    const { mode, setMode } = useTheme();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const current = OPTIONS.find((o) => o.value === mode) ?? OPTIONS[0];
    const CurrentIcon = current.Icon;

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                            bg-[(--bg-surface)] text-[(--text-primary)] hover:bg-[(--bg-muted)]
                            transition text-sm font-medium"
                title="Change theme"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <CurrentIcon size={16} />
                <span className="hidden sm:inline">{current.label}</span>
                <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    role="listbox"
                    className="absolute right-0 mt-2 w-36
                      bg-[(--bg-surface)] border border-[(--border)]
                     rounded-xl shadow-xl z-50 overflow-hidden"
                >
                    {OPTIONS.map(({ value, label, Icon }) => (
                        <button
                            key={value}
                            role="option"
                            aria-selected={mode === value}
                            onClick={() => { setMode(value); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition
                ${mode === value
                                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                }`}
                        >
                            <Icon size={15} />
                            {label}
                            {mode === value && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}