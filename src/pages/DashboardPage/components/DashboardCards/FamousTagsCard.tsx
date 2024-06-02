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

const FamousTagsCard: React.FC = () => {

  const {scopes} = useUserStore();

  const getFamousTags = async () => {
    if(scopes.includes('dmo')) {
      return (await dmoMonitorService.getMostConsumedTags()).data;
    } else {
      return (await providerMonitorService.getMostConsumedTags()).data;
    }
  }

  const {data: famousTags, isLoading} = useQuery<any>({
    queryKey: ['famousTags'],
    queryFn: getFamousTags,
  });

  console.log('famousTags', famousTags);

  if(isLoading) {
    return <div>Loading...</div>
  }

  return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Most Famous Tags
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
            <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {famousTags[0]} & {famousTags[1]}
          </div>
          <p className='text-xs text-muted-foreground'>
            This month
          </p>
        </CardContent>
      </Card>
  )
};

export default FamousTagsCard;
