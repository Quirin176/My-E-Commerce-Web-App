import { useCallback, useEffect, useState } from "react"

export default function Wordle() {
    const [randomWord, setRandomWord] = useState<string>("");

    const fetchRandomWord = useCallback(async () => {
        const data = await fetch("https://a04-wordle-api.vercel.app/api/random-word/");
        setRandomWord(data.word)
    }, []);

    useEffect(() => {
        fetchRandomWord()
    }, [fetchRandomWord])

    return (
        <div className="flex flex-col items-center justify-between">
            <h1 className="text-2xl font-bold text-yellow-400">WORDLE</h1>
            <p>{randomWord}</p>
        </div>
    )
}