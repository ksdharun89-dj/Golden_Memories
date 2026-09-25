import React, { useState } from 'react';
import { Language } from '../types';

interface Past7DaysLineChartProps {
  todayCompletedCount: number;
  language: Language;
}

interface DayData {
  dayEn: string;
  dayTa: string;
  count: number;
  isToday: boolean;
  fullDateEn: string;
  fullDateTa: string;
}

export const Past7DaysLineChart: React.FC<Past7DaysLineChartProps> = ({
  todayCompletedCount,
  language,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(6);

  // 7 days data with today's count dynamically bound to the activities list state!
  const past7Days: DayData[] = [
    { dayEn: 'Tue', dayTa: 'செவ்', count: 2, isToday: false, fullDateEn: 'Tuesday, Oct 18', fullDateTa: 'செவ்வாய், அக் 18' },
    { dayEn: 'Wed', dayTa: 'புதன்', count: 3, isToday: false, fullDateEn: 'Wednesday, Oct 19', fullDateTa: 'புதன், அக் 19' },
    { dayEn: 'Thu', dayTa: 'வியா', count: 2, isToday: false, fullDateEn: 'Thursday, Oct 20', fullDateTa: 'வியாழன், அக் 20' },
    { dayEn: 'Fri', dayTa: 'வெள்', count: 3, isToday: false, fullDateEn: 'Friday, Oct 21', fullDateTa: 'வெள்ளி, அக் 21' },
    { dayEn: 'Sat', dayTa: 'சனி', count: 4, isToday: false, fullDateEn: 'Saturday, Oct 22', fullDateTa: 'சனி, அக் 22' },
    { dayEn: 'Sun', dayTa: 'ஞாயி', count: 2, isToday: false, fullDateEn: 'Sunday, Oct 23', fullDateTa: 'ஞாயிறு, அக் 23' },
    { dayEn: 'Today', dayTa: 'இன்று', count: todayCompletedCount, isToday: true, fullDateEn: 'Today (Monday)', fullDateTa: 'இன்று (திங்கள்)' },
  ];

  const total7Days = past7Days.reduce((acc, d) => acc + d.count, 0);
  const maxVal = Math.max(5, ...past7Days.map((d) => d.count)) + 1; // ceiling for breathing room

  // Chart layout dimensions
  const svgWidth = 400;
  const svgHeight = 150;
  const paddingLeft = 36;
  const paddingRight = 24;
  const paddingTop = 26;
  const paddingBottom = 34;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates
  const points = past7Days.map((d, i) => {
    const x = paddingLeft + (i / (past7Days.length - 1)) * plotWidth;
    const y = paddingTop + (1 - d.count / maxVal) * plotHeight;
    return { ...d, x, y };
  });

  // Construct SVG path line string and area path
  const linePath = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${paddingTop + plotHeight} L ${points[0].x},${paddingTop + plotHeight} Z`;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[6];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eae4dc] flex flex-col space-y-3">
      {/* Header and Summary stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#181c20]">
            {language === 'ta' ? 'கடந்த 7 நாட்கள் செயல்பாடு' : 'Past 7 Days Progress'}
          </h2>
          <p className="text-[14px] text-[#42474d] mt-0.5">
            {language === 'ta'
              ? 'ஒவ்வொரு நாளும் முடிக்கப்பட்ட செயல்பாடுகளின் வரைபடம்'
              : 'Visual trend of completed daily cognitive activities'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[24px] font-bold text-[#0c405e] tabular-nums font-mono">
            {total7Days}
          </span>
          <span className="block text-[12px] font-semibold text-[#35675f] -mt-1">
            {language === 'ta' ? '7 நாட்கள் மொத்தம்' : '7-day total'}
          </span>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative w-full pt-1 overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="familyChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c405e" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#35675f" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#35675f" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 2, 4, maxVal].map((val, idx) => {
            const y = paddingTop + (1 - val / maxVal) * plotHeight;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#ebeef3"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? undefined : '3 3'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="600"
                  fill="#72787e"
                  fontFamily="sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill under curve */}
          <path d={areaPath} fill="url(#familyChartGradient)" />

          {/* Smooth connecting line */}
          <path
            d={linePath}
            fill="none"
            stroke="#0c405e"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            const isToday = pt.isToday;

            return (
              <g
                key={i}
                className="cursor-pointer transition-transform"
                onClick={() => setHoveredIndex(i)}
                onMouseEnter={() => setHoveredIndex(i)}
              >
                {/* Hit area for easy touching on mobile */}
                <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                {/* Outer halo for Today or Hovered */}
                {(isToday || isHovered) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? '10' : '8'}
                    fill={isToday ? '#b8ede3' : '#cbe6ff'}
                    opacity="0.6"
                    className={isToday ? 'animate-pulse' : ''}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '6' : '4.5'}
                  fill={isToday ? '#35675f' : '#ffffff'}
                  stroke={isToday ? '#00201c' : '#0c405e'}
                  strokeWidth="2.5"
                />

                {/* Value badge above node */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill={isToday ? '#0c405e' : '#181c20'}
                >
                  {pt.count}
                </text>

                {/* Day label on bottom */}
                <text
                  x={pt.x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={isToday || isHovered ? '700' : '600'}
                  fill={isToday ? '#0c405e' : '#42474d'}
                >
                  {language === 'ta' ? pt.dayTa : pt.dayEn}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected day active breakdown bar */}
      <div className="bg-[#f1f4f9] rounded-xl p-3 flex items-center justify-between border border-[#ebeef3]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#35675f]">
            event_available
          </span>
          <span className="text-[14px] font-bold text-[#181c20]">
            {language === 'ta' ? activePoint.fullDateTa : activePoint.fullDateEn}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[16px] font-bold text-[#0c405e]">
            {activePoint.count}
          </span>
          <span className="text-[13px] text-[#42474d]">
            {language === 'ta' ? 'செயல்பாடுகள்' : 'activities'}
          </span>
          {activePoint.isToday && (
            <span className="ml-1 text-[11px] font-bold bg-[#b8ede3] text-[#00201c] px-2 py-0.5 rounded-full">
              {language === 'ta' ? 'இன்று' : 'Live'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
