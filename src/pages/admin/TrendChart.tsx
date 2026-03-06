import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DailyData {
    date: string;
    count: number;
}

interface ChartPoint extends DailyData {
    x: number;
    y: number;
    label: string;
    fullDate: string;
    index: number;
}

const TrendChart = ({ data }: { data: DailyData[] }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Fill missing days to ensure we have a continuous trend (last 7 days by default)
    const processedData = React.useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const existing = data.find(item => item.date === dateStr);
            days.push({
                date: dateStr,
                count: existing ? existing.count : 0,
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
        }
        return days;
    }, [data]);

    const maxCount = Math.max(...processedData.map(d => d.count), 5); // Minimum scale of 5

    // Calculate points for the SVG (0-100 coordinate system)
    const points: ChartPoint[] = processedData.map((d, i) => {
        const x = (i / (processedData.length - 1)) * 100;
        const y = 85 - (d.count / maxCount) * 70; // Keep within 15-85 range for padding
        return { x, y, ...d, index: i };
    });

    // Generate Bezier Curve Path
    const getBezierPath = (pts: ChartPoint[]) => {
        if (pts.length === 0) return "";
        let path = `M ${pts[0].x} ${pts[0].y}`;

        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i];
            const p1 = pts[i + 1];
            // Control points for smoothness
            const cp1x = p0.x + (p1.x - p0.x) / 2;
            const cp1y = p0.y;
            const cp2x = p0.x + (p1.x - p0.x) / 2;
            const cp2y = p1.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
        }
        return path;
    };

    const linePath = getBezierPath(points);
    const areaPath = (pts: ChartPoint[]) => {
        if (pts.length === 0) return "";
        const bezier = getBezierPath(pts);
        return `${bezier} L 100 100 L 0 100 Z`;
    };

    return (
        <div className="w-full space-y-6">
            <div className="relative h-[180px] w-full bg-navy-deep/20 rounded-[6px] overflow-hidden border border-white/5 p-6 backdrop-blur-sm group/chart shadow-inner">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#BC9C33]/5 to-transparent pointer-events-none" />

                {/* Grid Lines */}
                <div className="absolute inset-x-6 inset-y-10 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="w-full h-px bg-white" />
                    ))}
                </div>

                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-x-6 inset-y-10 w-[calc(100%-48px)] h-[calc(100%-80px)] overflow-visible cursor-crosshair"
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#BC9C33" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#BC9C33" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Area Gradient */}
                    <motion.path
                        initial={{ opacity: 0, d: `M 0 100 L 0 90 L 100 90 L 100 100 Z` }}
                        animate={{ opacity: 1, d: areaPath(points) }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        fill="url(#chartGradient)"
                    />

                    {/* Main Line */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d={linePath}
                        fill="none"
                        stroke="#BC9C33"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        className="drop-shadow-[0_0_10px_rgba(188,156,51,0.5)]"
                    />

                    {/* Interactive Segments for Hover */}
                    {points.map((p, i) => (
                        <rect
                            key={`hitbox-${i}`}
                            x={p.x - 5}
                            y={0}
                            width={10}
                            height={100}
                            fill="transparent"
                            className="pointer-events-auto"
                            onMouseEnter={() => setHoveredIndex(i)}
                        />
                    ))}

                    {/* Data Points */}
                    {points.map((p, i) => (
                        <g key={`point-${i}`}>
                            <motion.circle
                                initial={{ r: 0 }}
                                animate={{
                                    r: hoveredIndex === i ? 5 : (p.count > 0 ? 3 : 2),
                                    fill: hoveredIndex === i ? "#fff" : "#BC9C33"
                                }}
                                transition={{ duration: 0.2 }}
                                cx={p.x}
                                cy={p.y}
                                className="drop-shadow-[0_0_8px_rgba(188,156,51,0.8)]"
                            />

                            {/* Pulse for selected point */}
                            {hoveredIndex === i && (
                                <motion.circle
                                    initial={{ r: 3, opacity: 1 }}
                                    animate={{ r: 12, opacity: 0 }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    cx={p.x}
                                    cy={p.y}
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="1"
                                />
                            )}
                        </g>
                    ))}
                </svg>

                {/* Floating Tooltip Display */}
                <AnimatePresence>
                    {hoveredIndex !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                            exit={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                            className="absolute top-4 left-1/2 bg-white/90 backdrop-blur-md rounded-[6px] px-5 py-2.5 shadow-2xl border border-white/20 flex items-center gap-3 z-20 group-hover/chart:translate-y-[-5px] transition-transform"
                        >
                            <div className="text-left">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#BC9C33] leading-none mb-1.5 font-display">
                                    {processedData[hoveredIndex].fullDate}
                                </p>
                                <p className="text-sm font-black text-navy-deep leading-none font-display">
                                    {processedData[hoveredIndex].count} <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Daily Visits</span>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-6">
                {processedData.map((dayItem, i) => (
                    <div
                        key={i}
                        className={`text-center transition-all duration-300 cursor-pointer ${hoveredIndex === i ? 'scale-125 translate-y-[-2px]' : 'opacity-30'}`}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <p className={`text-[10px] font-black text-white ${hoveredIndex === i ? 'text-[#BC9C33]' : ''} transition-colors uppercase tracking-widest`}>{dayItem.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendChart;
