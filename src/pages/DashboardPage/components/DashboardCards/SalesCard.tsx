import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dmoMonitorService, providerMonitorService } from '@/services/Client/MonitorService';
import { useUserStore } from '@/stores/useUserStore';
import { useQuery } from '@tanstack/react-query';

const SalesCard: React.FC = () => {

  const {scopes} = useUserStore();

  const getSales = async () => {
    if(scopes.includes('dmo')) {
      return (await dmoMonitorService.getNumberOfSalesThisMonth()).data;
    } else {
      return (await providerMonitorService.getNumberOfSalesThisMonth()).data;
    }
  }

  const {data: sales, isLoading} = useQuery<any>({
    queryKey: ['sales'],
    queryFn: getSales,
  });

  const getSalesComparison = async () => {
    if(scopes.includes('dmo')) {
      return (await dmoMonitorService.getNumberOfSalesComparisonWithPreviousMonth()).data;
    } else {
      return (await providerMonitorService.getNumberOfSalesComparisonWithPreviousMonth()).data;
    }
  }

  const {data: salesComparison} = useQuery<any>({
    queryKey: ['salesComparison'],
    queryFn: getSalesComparison,
  });

  if (isLoading) {
    return <div>Loading...</div>
  }

  let salesComparisonPercentage;

  if (salesComparison === sales[0].total) {
    salesComparisonPercentage = salesComparison
  } else {
    salesComparisonPercentage = sales && salesComparison ? (sales[0].total - salesComparison) / salesComparison * 100 : 0;
  }

  return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Sales
          </CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <rect width='20' height='14' x='2' y='5' rx='2' />
            <path d='M2 10h20' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            +{sales[0].total}
          </div>
          <p className='text-xs text-muted-foreground'>
            +{salesComparisonPercentage}% from last month
          </p>
        </CardContent>
      </Card>
  )
};

export default SalesCard;
