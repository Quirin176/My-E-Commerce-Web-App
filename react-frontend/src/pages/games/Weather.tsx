import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const API_COORDINATE = "https://geocoding-api.open-meteo.com/v1/search?name=ho%20chi%20minh";

export default function Weather() {
    const [apiCoordinate, setApiCoordinate] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [location, setLocation] = useState<string>("");

    const [time, setTime] = useState<Array<Date>>();
    const [temp, setTemp] = useState<Array<number>>();
    const weatherData = time?.map((t, index) => {
        return {
            displayTime: t.getHours() + ":00",
            temperature: temp ? temp[index] : 0,
        };
    }) || [];

    const fetchcoordinates = useCallback(async (api: string) => {
        setLoading(true);

        try {
            const res1 = await fetch(api);
            const data1 = await res1.json();

            if (data1.results && data1.results.length > 0) {
                const res2 = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data1.results[0].latitude}&longitude=${data1.results[0].longitude}&hourly=temperature_2m`);
                const data2 = await res2.json();

                if (data2.hourly.time && data2.hourly.time.length > 0) {
                    setTime(data2.hourly.time.slice(0, 24).map((value: string) => new Date(value)));
                }

                if (data2.hourly.temperature_2m && data2.hourly.temperature_2m.length > 0) {
                    setTemp(data2.hourly.temperature_2m.slice(0, 24));
                }
            }
        } catch (error: unknown) {
            toast.error("Failed fetching data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!apiCoordinate) return;
        fetchcoordinates(apiCoordinate);
    }, [apiCoordinate]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const parseLocation = location.replaceAll(" ", "%20");
            setApiCoordinate("https://geocoding-api.open-meteo.com/v1/search?name=" + parseLocation);
        }
    };

    return (
        <div>
            {
                loading ? (
                    <div>
                        <p>
                            loading
                        </p>
                    </div >
                ) : (
                    <div className="flex flex-col items-center justify-between w-full h-full">
                        <h1 className="text-4xl font-bold mt-8 text-blue-500">Weather</h1>

                        <input
                            type="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="rounded border my-8"
                        />

                        <div className="grid grid-cols-3 gap-4">
                            {time && temp && time.map((t, index) => (
                                <WeatherCard
                                    key={index}
                                    time={t}
                                    temp={temp[index]}
                                />
                            ))}
                        </div >
                        <div style={{ width: 800, height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={weatherData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                                    {/* X-Axis with Title */}
                                    <XAxis
                                        dataKey="displayTime"
                                        label={{ value: 'Time (Hourly)', position: 'insideBottom', offset: -10 }}
                                    />

                                    {/* Y-Axis with Title */}
                                    <YAxis
                                        label={{
                                            value: 'Temperature (°C)',
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: { textAnchor: 'middle' }
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${value}`, 'Temperature']}
                                        labelStyle={{ color: 'black' }}
                                    />

                                    <Line
                                        name="Temperature"
                                        unit="°C"
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#8884d8"
                                        strokeWidth={4}
                                        dot={{ r: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div >
                )
            }
        </div>
    );

    type WeatherCardProps = {
        time: Date,
        temp: number
    };

    function WeatherCard({ time, temp }: WeatherCardProps) {
        return (
            <div className="flex flex-row rounded border-2 bg-yellow-300">
                <div className="border-r-2 px-6 py-2 w-32">{time.toLocaleDateString('en-GB')}</div>
                <div className="px-6 py-2 w-24">{temp}°C</div>
            </div>
        );
    };
};