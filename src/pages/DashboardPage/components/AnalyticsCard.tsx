import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TimeData {
    time: string;
    offers: number;
    sales: number;
    visits: number;
    [key: string]: string | number;
}

const allData: TimeData[] = [];

const generateTimeData = (timeUnit: string): TimeData[] => {
    const randomValue = () => Math.floor(Math.random() * 1000) + 100;
    let data: TimeData[] = [];
    switch (timeUnit) {
        case 'months':
            const months = ['Jan 23', 'Feb 23', 'Mar 23', 'Apr 23', 'May 23', 'Jun 23', 'Jul 23', 'Aug 23', 'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23'];
            months.forEach(month => {
                data.push({ time: month, offers: randomValue(), sales: randomValue(), visits: randomValue() });
            });
            break;
        case 'days':
            data = Array.from({ length: 30 }, (_, i) => ({ time: `Day ${i + 1}`, offers: randomValue(), sales: randomValue(), visits: randomValue() }));
            break;
        case 'hours':
            data = Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, offers: randomValue(), sales: randomValue(), visits: randomValue() }));
            break;
    }
    return data;
}
;
const generateFutureData = (data: TimeData[], timeUnit: string): TimeData[] => {
    const lastDataPoint = data[data.length - 1];
    const futureData = [lastDataPoint];
    const trend = (value: number) => Math.random() < 0.5 ? value - Math.random() * 100 : value + Math.random() * 100;

    switch (timeUnit) {
        case 'months':
            const futureMonths = ['Jan 24', 'Feb 24', 'Mar 24'];
            futureMonths.forEach((month, i) => {
                futureData.push({
                    time: month,
                    offers: Math.floor(trend(lastDataPoint.offers)),
                    sales: Math.floor(trend(lastDataPoint.sales)),
                    visits: Math.floor(trend(lastDataPoint.visits)),
                });
            });
            break;
        case 'days':
            for (let i = 1; i <= 7; i++) {
                futureData.push({
                    time: `Day ${data.length + i}`,
                    offers: Math.floor(trend(lastDataPoint.offers)),
                    sales: Math.floor(trend(lastDataPoint.sales)),
                    visits: Math.floor(trend(lastDataPoint.visits)),
                });
            }
            break;
        case 'hours':
            for (let i = 1; i <= 24; i++) {
                futureData.push({
                    time: `${data.length + i}:00`,
                    offers: Math.floor(trend(lastDataPoint.offers)),
                    sales: Math.floor(trend(lastDataPoint.sales)),
                    visits: Math.floor(trend(lastDataPoint.visits)),
                });
            }
            break;
    }
    console.log(futureData);

    return futureData;
};

export default function AnalyticsCard() {
    const [timeUnit, setTimeUnit] = useState('months');
    const [metric, setMetric] = useState('offers');
    const [data, setData] = useState(generateTimeData('months'));
    const [futureData, setFutureData] = useState<TimeData[]>([]);

    const maxValue = Math.max(...data.map((item) => item[metric] as number));
    
    const handleTimeUnitChange = (newTimeUnit: string) => {
        setTimeUnit(newTimeUnit);
        setData(generateTimeData(newTimeUnit));
        setFutureData([]);  // Reset future data on time unit change
    };

    const handleAddFutureData = () => {
        setFutureData(generateFutureData(data, timeUnit));
    };

  return (
    <Card className="m-4 shadow-xl rounded-lg"> {/* Added margins and shadow for better styling */}
      <CardHeader>
        <div className='flex justify-between items-center'>
            <div className='space-y-2'>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>View your analytics data in an easy-to-understand way.</CardDescription>
            </div>
            <div>
                <Button className="text-sm bg-primary text-white" onClick={handleAddFutureData}>Predict Future Data</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4"> {/* Added padding for internal spacing */}
        <div className='flex justify-between items-center mb-4'>
        <div className="flex space-y-2 flex-col">
            <Label htmlFor="timeUnit">Time Unit</Label>
            <Select defaultValue={timeUnit} onValueChange={handleTimeUnitChange}>
                <SelectTrigger id='timeUnit' aria-label="Select time unit" className="w-32">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="days">Last 30 Days</SelectItem>
                    <SelectItem value="hours">Last 24 Hours</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="flex space-y-2 flex-col">
            <Label htmlFor="metric">Metric</Label>
            <Select defaultValue={metric} onValueChange={setMetric}>
                <SelectTrigger id='metric' aria-label="Select metric" className="w-32">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="offers">Offers</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="visits">Visits</SelectItem>
                </SelectContent>
            </Select>
        </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" allowDuplicatedCategory={false} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={metric} stroke="#8884d8" strokeWidth={2} data={data} activeDot={{ r: 8 }} />
            {futureData.length > 0 && (
                <Line type="monotone" dataKey={metric} stroke="#FFA500" strokeWidth={2} strokeDasharray="5 5" data={futureData} name={`Predicted ${metric}`}/>            )}
            <Legend height={36} />
            <ReferenceLine y={maxValue} label={{ value: `Max: ${maxValue}`, position: 'insideTop', offset: 10 }} stroke="red" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
