import { Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { LineChartPoints } from '../../../types/dto/AdminDashboardDTOs';

interface DashboardLineChartProp {
    data: LineChartPoints[] | undefined
}

const formatMoney = (value: number) => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toString();
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
    });
};

const formatTooltipLabel = (label: any) => {
    const d = new Date(label);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit"
    });
};

export default function DashboardLineChart({ data }: DashboardLineChartProp) {
    return (
        <div className="w-1/2 rounded-2xl bg-gray-50 shadow p-6">
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
                Revenue Analytics
            </h2>

            {/* Chart container — full width, fixed height */}
            <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />

                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12 }}
                        />

                        <YAxis
                            tickFormatter={formatMoney}
                            tick={{ fontSize: 12 }}
                        />

                        <Tooltip
                            formatter={(v) => formatMoney(Number(v))}
                            labelFormatter={formatTooltipLabel}
                            contentStyle={{
                                borderRadius: 10,
                                borderColor: "#d1d5db",
                                backgroundColor: "white",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                            }}
                        />

                        <Legend verticalAlign="top" height={40} />

                        <Line
                            name="Orders"
                            type="monotone"
                            dataKey="orderCount"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />

                        <Line
                            name="Revenue (VND)"
                            type="monotone"
                            dataKey="totalRevenue"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}