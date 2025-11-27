import React, { useState } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

const DATA_1D = [
    { date: '10:00', value: 12400 },
    { date: '11:00', value: 12420 },
    { date: '12:00', value: 12380 },
    { date: '13:00', value: 12450 },
    { date: '14:00', value: 12480 },
    { date: '15:00', value: 12450 },
];

const DATA_1W = [
    { date: 'Mon', value: 11800 },
    { date: 'Tue', value: 12000 },
    { date: 'Wed', value: 11950 },
    { date: 'Thu', value: 12200 },
    { date: 'Fri', value: 12450 },
    { date: 'Sat', value: 12400 },
    { date: 'Sun', value: 12450 },
];

const DATA_1M = [
    { date: 'Week 1', value: 10500 },
    { date: 'Week 2', value: 11200 },
    { date: 'Week 3', value: 11800 },
    { date: 'Week 4', value: 12450 },
];

const DATA_ALL = [
    { date: 'Jan', value: 10000 },
    { date: 'Feb', value: 9500 },
    { date: 'Mar', value: 10200 },
    { date: 'Apr', value: 11000 },
    { date: 'May', value: 10800 },
    { date: 'Jun', value: 12450 },
];

const TIMEFRAMES = ['1D', '1W', '1M', 'ALL'] as const;
type Timeframe = typeof TIMEFRAMES[number];

export default function PerformanceChart() {
    const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1W');

    const getData = () => {
        switch (activeTimeframe) {
            case '1D': return DATA_1D;
            case '1W': return DATA_1W;
            case '1M': return DATA_1M;
            case 'ALL': return DATA_ALL;
            default: return DATA_1W;
        }
    };

    interface TooltipProps {
        active?: boolean;
        payload?: Array<{ value: number; payload: { date: string; value: number } }>;
        label?: string;
    }

    const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
        if (active && payload && payload.length) {
            const currentValue = payload[0].value;
            const currentData = getData();
            const currentIndex = currentData.findIndex(d => d.date === label);
            let change = 0;
            let changePercent = 0;

            if (currentIndex > 0) {
                const prevValue = currentData[currentIndex - 1].value;
                change = currentValue - prevValue;
                changePercent = (change / prevValue) * 100;
            }

            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-lg min-w-[140px]">
                    <p className="text-slate-400 text-[10px] mb-1 font-mono">{label}</p>
                    <div className="flex items-end gap-2">
                        <p className="text-white font-mono font-bold text-lg leading-none">
                            ${currentValue.toLocaleString()}
                        </p>
                        {currentIndex > 0 && (
                            <p className={clsx(
                                "text-xs font-mono font-bold mb-0.5",
                                change >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                                {change >= 0 ? '+' : ''}{change.toLocaleString()} ({changePercent.toFixed(1)}%)
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-slate-900/20 border border-slate-800 rounded-lg p-4 backdrop-blur-sm mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Performance</h3>
                <div className="flex bg-slate-800/50 rounded-lg p-0.5">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setActiveTimeframe(tf)}
                            className={clsx(
                                "px-3 py-1 text-[10px] font-medium rounded-md transition-all",
                                activeTimeframe === tf
                                    ? "bg-slate-700 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getData()}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#f97316"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
