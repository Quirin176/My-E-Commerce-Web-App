import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDE_DATA = [
    {
        subtitle: "STAFF FAVOURITES",
        title: <>The shelves we keep coming back to</>,
        description: <>Our booksellers pick the titles they can't stop pressing into customers' hands.</>,
        buttonText: "Browse bestsellers"
    },
    {
        subtitle: "NEW RELEASES",
        title: <>Fresh stories waiting to be discovered</>,
        description: <>Explore the hottest new arrivals hitting our shelves this week.</>,
        buttonText: "Explore new products from categories"
    },
    {
        subtitle: "EZ GAMES FRONTEND TEST DEMO",
        title: <>This is a demo for the frontend test</>,
        description: <>Created by Vo Quang Qui, applying for the frontend developer internship position.</>,
        buttonText: "Contact me 0938 259 213"
    }
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);    // 0, 1, 2...

    // Handle navigation
    const nextSlide = () => {
        setCurrentSlide(prev => prev === SLIDE_DATA.length - 1 ? 0 : prev + 1);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => prev === 0 ? SLIDE_DATA.length - 1 : prev - 1);
    };

    // Auto slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentSlide]); // Reset timer whenever slide changes

    return (
        <div className="h-full relative overflow-hidden">

            {/* Previous Slide Button */}
            <button
                className="absolute top-1/2 left-4 p-2 bg-(--bg-muted) rounded-full cursor-pointer z-40"
                onClick={() => prevSlide()}
            >
                <ChevronLeft />
            </button>

            {/* Slide Content */}
            <div
                className="flex w-full h-full transition-all duration-600 ease-in-out z-1"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {SLIDE_DATA.map((slide, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-between min-w-full h-full p-6 sm:p-18">

                        <div className="flex flex-col gap-4">
                            <p className="font-semibold text-(--brand-primary)">
                                {slide.subtitle}
                            </p>

                            <h1 className="text-2xl sm:text-4xl font-bold text-(--brand-primary)">{slide.title}</h1>

                            <p className="text-lg sm:text-3xl font-bold text-(--brand-primary)">{slide.description}</p>
                        </div>

                        <button className="font-bold text-white bg-(--brand-primary) p-4 border rounded-4xl cursor-pointer">
                            {slide.buttonText}
                        </button>

                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {SLIDE_DATA.map((_, index) => (
                    <span
                        key={index}
                        className={`${index === currentSlide ? "bg-(--brand-primary) w-8 h-3 rounded-2xl"
                            : "bg-(--bg-muted) w-3 h-3 rounded-full cursor-pointer transition-all duration-200 ease-in-out"}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>

            {/* Next Slide Button */}
            <button
                className="absolute top-1/2 right-4 p-2 bg-(--bg-muted) rounded-full cursor-pointer z-40"
                onClick={() => nextSlide()}
            >
                <ChevronRight />
            </button>

        </div>
    );
}