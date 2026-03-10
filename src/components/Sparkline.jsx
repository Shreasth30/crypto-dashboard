import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { motion } from 'framer-motion';

export default function Sparkline({ data, isPositive }) {
    if (!data || data.length === 0) return <div className="h-10 w-24"></div>;

    const chartData = data.map((price, index) => ({
        name: index,
        value: price,
    }));

    const color = isPositive ? '#34d399' : '#fb7185'; // emerald-400 : rose-400

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-12 w-28 pointer-events-none"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={1.5}
                        dot={false}
                        isAnimationActive={false} // Framer handles parent fade
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
