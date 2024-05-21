import React, { PureComponent, useState } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';

const data = [
    { name: 'Portugal', value: 100, color: '#1c64f2' }, // Blue color
    { name: 'Brasil', value: 44, color: '#10b981' }, // Green color
    { name: 'UK', value: 12, color: '#f59e0b' }, // Yellow color
    { name: 'Spain', value: 22, color: '#7e22ce' } // Purple color
  ];
  
const renderActiveShape = (props: { cx: any; cy: any; midAngle: any; innerRadius: any; outerRadius: any; startAngle: any; endAngle: any; fill: any; payload: any; percent: any; value: any; }) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
        <g>
          <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
            {payload.name}
          </text>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={payload.color}
          />
          <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={payload.color}
          />
          <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={payload.color} fill="none" />
          <circle cx={ex} cy={ey} r={2} fill={payload.color} stroke="none" />
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} users`}</text>
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
            {`(Rate ${(percent * 100).toFixed(2)}%)`}
          </text>
        </g>
      );
    };

interface NationalitiesPieChartProps {}


export const Nationalities: React.FC<NationalitiesPieChartProps> = ({}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_: any, index: React.SetStateAction<number>) => {
      setActiveIndex(index);
    };

    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <PieChart width={500} height={300}>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={index === activeIndex ? 1 : 0.6} />
                ))}
                </Pie>
            </PieChart>
        </div>
    );
}