import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dmoMonitorService, providerMonitorService } from '@/services/Client/MonitorService';
import { useUserStore } from '@/stores/useUserStore';
import { useQuery, useQueries } from '@tanstack/react-query';
import { UserService } from '@/services/Client/UserService';
import { OfferService } from '@/services/Client/OfferService';
import RecentSaleItem from './RecentSaleItem';

export function RecentSales() {

  const { scopes } = useUserStore();
  const [userIds, setUserIds] = useState<string[]>([]);
  const [offerIds, setOfferIds] = useState<number[]>([]);

  const getRecentSales = async () => {
    if (scopes.includes('dmo')) {
      return (await dmoMonitorService.getLastPayments()).data;
    } else {
      return (await providerMonitorService.getLastPayments()).data;
    }
  }

  const { data: recentSales, isLoading, isSuccess } = useQuery<any>({
    queryKey: ['recentSales'],
    queryFn: getRecentSales,
  });

  useEffect(() => {
    if (isSuccess) {
      setUserIds(recentSales.map((sale: any) => sale.userid));
      setOfferIds(recentSales.map((sale: any) => sale.offer_id));
    }
  }, [recentSales]);

  // get offers by offer id
  const getOfferById = async (offerId: number) => {
    return (await OfferService.getOffer(offerId)).data;
  }

  const OfferResults = useQueries({
    queries: offerIds.map((id: number) => ({
      queryKey: ['offer', id],
      queryFn: () => getOfferById(id),
      staleTime: Infinity,
    }))
  });

  // get users by user id
  const getUserByUserId = async (userId: string) => {
    return (await UserService.getUserByUserId(userId)).data;
  }

  const UserResults = useQueries({
    queries: userIds.map((id: string) => ({
      queryKey: ['user', id],
      queryFn: () => getUserByUserId(id),
      staleTime: Infinity,
    }))
  });

  if (isLoading || UserResults.some((result) => result.isLoading) || OfferResults.some((result) => result.isLoading)) {
    return <div>Loading...</div>
  }

  if (UserResults.some((result) => result.isError) || OfferResults.some((result) => result.isError)) {
    return <div>Error...</div>
  }

  const usersData = UserResults.map((result) => result.data);
  const offersData = OfferResults.map((result) => result.data);

  return (
    <div className='space-y-2 overflow-y-auto h-96 pr-2'>
      {recentSales.slice(-5).map((sale: any, index: number) => (
        <RecentSaleItem key={sale._id} user={usersData[index]} offer={offersData[index]} sale={sale} />
      ))}
    </div>
  );
}
