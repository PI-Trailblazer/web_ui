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

const ProfitCard: React.FC = () => {

  const {scopes} = useUserStore();

  //get profit this month

  const getProfitThisMonth = async () => {
    if(scopes.includes('dmo')) {
      return (await dmoMonitorService.getProfitThisMonth()).data;
    } else {
      return (await providerMonitorService.getProfitThisMonth()).data;
    }
  }

  const {data: profit, isLoading} = useQuery<any>({
    queryKey: ['profit'],
    queryFn: getProfitThisMonth,
  });

  console.log('profit', profit);

  //get profit compared to last month
  const getProfitComparison = async () => {
    if(scopes.includes('dmo')) {
      return (await dmoMonitorService.getProfitComparisonWithPreviousMonth()).data;
    } else {
      return (await providerMonitorService.getProfitComparisonWithPreviousMonth()).data;
    }
  }

  const {data: profitComparison} = useQuery<any>({
    queryKey: ['profitComparison'],
    queryFn: getProfitComparison,
  });

  if (isLoading) {
    return <div>Loading...</div>
  }

  let profitComparisonPercentage;

  if (profitComparison === profit[0].profit) {
    profitComparisonPercentage = profitComparison
  } else {
    profitComparisonPercentage = profit && profitComparison ? (profit[0].profit - profitComparison) / profitComparison * 100 : 0;
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          Profit
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
          <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
          <circle cx='9' cy='7' r='4' />
          <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
        </svg>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>${profit[0].profit}</div>
        <p className='text-xs text-muted-foreground'>
          +{profitComparisonPercentage}% from last month
        </p>
      </CardContent>
    </Card>
  )
};

export default ProfitCard;
