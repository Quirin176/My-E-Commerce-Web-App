import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RotateCcw } from "lucide-react";

interface Pokemon {
    name: string,
    url: string
}

export default function WhosThatPokemon() {
    const [recentPokemon, setRecentPokemon] = useState<Pokemon | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [guess, setGuess] = useState<string>("");
    const [chance, setChance] = useState<number>(3);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [lose, setLose] = useState<boolean>(false);

    const fetchNewPokemon = useCallback(async () => {
        setIsCorrect(false);
        setLose(false);
        setGuess("");
        setChance(3);

        const res1 = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
        const data1 = await res1.json();

        if (data1.results && data1.results.length > 0) {
            const randomItem = data1.results[Math.floor(Math.random() * data1.results.length)];
            setRecentPokemon(randomItem);

            const res2 = await fetch(randomItem.url)
            const data2 = await res2.json();
            setImageUrl(data2.sprites.front_default)
        }
    }, []);

    useEffect(() => {
        fetchNewPokemon();
    }, [])

    const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (guess.toLowerCase().trim() === recentPokemon?.name.toLocaleLowerCase()) {
                toast.success(`Correct! It's ${recentPokemon.name.toUpperCase()}!`);
                setIsCorrect(true);

                return;
            }

            toast.error("Not quite! Try again.");

            setChance(prev => {
                const updated = prev - 1;

                if (updated <= 0) {
                    toast.error(`You lose. That is ${recentPokemon?.name}`);
                    setLose(true);
                }

                return updated > 0 ? updated : 3;
            });
        }
    }

    return (
        <div className="flex flex-col items-center justify-between gap-y-8">
            {/* <div>{recentPokemon?.name}</div>
            <div>{recentPokemon?.url}</div> */}
            <h1 className="text-4xl font-bold text-yellow-400 mt-16">WHO'S THAT POKEMON?</h1>

            <p className="text-2xl font-bold">You have {chance} chances left</p>

            <img
                src={imageUrl}
                className={`w-80 h-80 rounded border-2 transition-all duration-500 ${isCorrect ? "brightness-100" : "brightness-0"}`}
            />
            <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={handleSubmit}
                className="rounded border-2 w-120 text-2xl"
            />

            <button onClick={fetchNewPokemon}>
                <RotateCcw className="w-12 h-12"></RotateCcw>
            </button>
        </div>
    )
}