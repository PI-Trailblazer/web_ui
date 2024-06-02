import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { dmoMonitorService, providerMonitorService } from '@/services/Client/MonitorService';
import { useUserStore } from '@/stores/useUserStore';
import { useQuery } from '@tanstack/react-query';

interface TimeData {
    time: string;
    [key: string]: string | number;
}

interface PostData {
    date: string;
    count: number;
}

const validCombinations = {
    month: ['num_payments', 'profit'],
    day: ['num_payments', 'profit'],
};

export default function AnalyticsCard() {
    const { scopes } = useUserStore();
    const [timeUnit, setTimeUnit] = useState('month');
    const [metric, setMetric] = useState('total_offers');
    const [data, setData] = useState<TimeData[]>([]);
    const [futureData, setFutureData] = useState<TimeData[]>([]);

    //get future data
    const getPredictedData = async (x: string, y: string) => {
        if (scopes.includes('dmo')) {
            return (await dmoMonitorService.getPrediction(x, y)).data;
        } else {
            return (await providerMonitorService.getPrediction(x, y)).data;
        }
    };

    const { data: predictedData } = useQuery<PostData[]>({
        queryKey: ['predictedData', timeUnit, metric],
        queryFn: () => getPredictedData(timeUnit, metric),
        enabled: validCombinations[timeUnit]?.includes(metric),
    });

    //get analysis data
    const getAnalysis = async (x: string, y: string) => {
        if (scopes.includes('dmo')) {
            return (await dmoMonitorService.getAnalysis(x, y)).data;
        } else {
            return (await providerMonitorService.getAnalysis(x, y)).data;
        }
    };

    const { data: analysisData, isLoading, isSuccess } = useQuery<PostData[]>({
        queryKey: ['analysisData', timeUnit, metric],
        queryFn: () => getAnalysis(timeUnit, metric),
    });

    useEffect(() => {
        if (isSuccess && analysisData) {
            const formattedData = analysisData.map(item => ({
                time: item.date,
                [metric]: item.count,
            }));
            setData(formattedData);
            setFutureData([]); // Reset future data when main data changes
        }
    }, [analysisData, metric, isSuccess]);

    const maxValue = Math.max(...data.map((item) => item[metric] as number));

    const handleTimeUnitChange = (newTimeUnit: string) => {
        setTimeUnit(newTimeUnit);
    };

    const handleMetricChange = (newMetric: string) => {
        setMetric(newMetric);
    };

    const handleAddFutureData = () => {
        if (predictedData) {
            const formattedPredictedData = predictedData.map(item => ({
                time: item.date,
                [metric]: item.count,
            }));
            const lastCurrentDataPoint = data[data.length - 1];
            setFutureData([lastCurrentDataPoint, ...formattedPredictedData]);
        }
    };

    const isPredictButtonDisabled = !validCombinations[timeUnit]?.includes(metric);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="m-4 shadow-xl rounded-lg">
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <div className='space-y-2'>
                        <CardTitle>Analytics Overview</CardTitle>
                        <CardDescription>View your analytics data in an easy-to-understand way.</CardDescription>
                    </div>
                    <div>
                        <Button 
                            className="text-sm bg-primary text-white" 
                            onClick={handleAddFutureData} 
                            disabled={isPredictButtonDisabled}
                        >
                            Predict Future Data
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className='flex justify-between items-center mb-4'>
                    <div className="flex space-y-2 flex-col">
                        <Label htmlFor="timeUnit">Time Unit</Label>
                        <Select defaultValue={timeUnit} onValueChange={handleTimeUnitChange}>
                            <SelectTrigger id='timeUnit' aria-label="Select time unit" className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">Months</SelectItem>
                                <SelectItem value="day">Last 30 Days</SelectItem>
                                <SelectItem value="hour">Last 24 Hours</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex space-y-2 flex-col">
                        <Label htmlFor="metric">Metric</Label>
                        <Select defaultValue={metric} onValueChange={handleMetricChange}>
                            <SelectTrigger id='metric' aria-label="Select metric" className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="total_offers">Total Offers</SelectItem>
                                <SelectItem value="new_offers">Sales</SelectItem>
                                <SelectItem value="num_payments">Visits</SelectItem>
                                <SelectItem value="profit">Profit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={[...data, ...futureData]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" allowDuplicatedCategory={false} />
                        <YAxis tickFormatter={(value) => Math.floor(value).toString()} />                                                
                        <Tooltip formatter={(value) => Math.floor(Number(value)).toString()} />
                        <Line type="monotone" dataKey={metric} stroke="#8884d8" data={data} strokeWidth={2} activeDot={{ r: 8 }} />
                        {futureData.length > 0 && (
                            <Line type="monotone" dataKey={metric} data={futureData} stroke="#FFA500" strokeWidth={2} strokeDasharray="5 5" name={`Predicted ${metric}`} />
                        )}
                        <Legend height={36} />
                        <ReferenceLine y={maxValue} label={{ value: `Max: ${maxValue}`, position: 'insideTop', offset: 10 }} stroke="red" strokeDasharray="3 3" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
