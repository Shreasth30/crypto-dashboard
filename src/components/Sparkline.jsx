import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { useId } from 'react';

export default function Sparkline({ data, isPositive }) {
    const uniqueId = useId();
    if (!data || data.length === 0) return <div className="h-10 w-24"></div>;

    const chartData = data.map((price, index) => ({
        name: index,
        value: price,
    }));

    const color = isPositive ? '#10b981' : '#f43f5e'; // emerald-500 : rose-500
    // Strip colons from useId to create valid CSS ids
    const gradientId = `sparkline-${uniqueId.replace(/:/g, '')}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-10 w-24 pointer-events-none"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={1.5}
                        fill={`url(#${gradientId})`}
                        dot={false}
                        isAnimationActive={false} // Parent handles opacity fade
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
