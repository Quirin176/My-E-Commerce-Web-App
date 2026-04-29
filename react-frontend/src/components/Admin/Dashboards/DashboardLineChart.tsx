import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardLineChart(data: Array<Number>) {

    return (
        <div className="flex flex-col items-center justify-between w-full h-full">
            <h1 className="text-4xl font-bold mt-8 text-blue-500">Weather</h1>

            <div style={{ width: 800, height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={data}
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
    );
};