import { Button } from '@/components/custom/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Layout, LayoutBody} from '@/components/custom/layout'
import { RecentSales } from './components/recent-sales'
import { Overview } from './components/overview'
import { Nationalities } from './components/NationalitiesPieChart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SetStateAction, useState } from 'react'
import AnalyticsCard from './components/AnalyticsCard'
import NewOffersCard from './components/DashboardCards/NewOffersCard'
import ProfitCard from './components/DashboardCards/ProfitCard'
import FamousTagsCard from './components/DashboardCards/FamousTagsCard'
import SalesCard from './components/DashboardCards/SalesCard'
import { dmoMonitorService, providerMonitorService } from '@/services/Client/MonitorService';
import { useUserStore } from '@/stores/useUserStore';
import { useQuery, useQueries } from '@tanstack/react-query';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('nationalities');
  const [title, setTitle] = useState('Nationalities');
  const [description, setDescription] = useState('Percentage of users by nationality.');
  const { scopes } = useUserStore();

  const getPayments = async () => {
    if (scopes.includes('dmo')) {
      return (await dmoMonitorService.getPayments()).data;
    } else {
      return (await providerMonitorService.getPayments()).data;
    }
  }

  const { data: payments, isLoading, isSuccess } = useQuery<any>({
    queryKey: ['payments'],
    queryFn: getPayments,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSelectChange = (value: SetStateAction<string>) => {
    setActiveTab(value);
    if (value === 'sales') {
      setTitle('Recent Sales');
      setDescription('Total number of sales: ' + payments.length);
    } else {
      setTitle('Nationalities');
      setDescription('Percentage of users by nationality.');
    }
  };

  return (
    <Layout>
      {/* ===== Main ===== */}
      <LayoutBody className='space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Dashboard
          </h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <NewOffersCard />
              <ProfitCard />
              <SalesCard />
              <FamousTagsCard />
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Distribution of Offer Types</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <div className='flex justify-between w-full'>
                    <div>
                      <CardTitle>{title}</CardTitle>
                      <CardDescription>
                        {description}
                      </CardDescription>
                    </div>
                    <div>
                      <Select defaultValue="nationalities" onValueChange={handleSelectChange}>
                        <SelectTrigger aria-label="Select a category" className="w-32">
                          <SelectValue placeholder="Category"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="nationalities">Nationalities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeTab === 'sales' && <RecentSales /> }
                  {activeTab === 'nationalities' && <Nationalities />}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='flex items-center justify-center h-full'>
            <div className='w-full max-w-7xl'>
              <AnalyticsCard />
            </div>
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  )
}