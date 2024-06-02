import React, { useEffect, useState } from 'react';
import { Payment } from '@/lib/types';
import { UserService } from '@/services/Client/UserService';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OfferTransactionsProps {
  payments: Payment[];
}

const OfferTransactions: React.FC<OfferTransactionsProps> = ({ payments }) => {
    
    const [userIds, setUserIds] = useState<string[]>([]);

    useEffect(() => {
        setUserIds(payments.map((payment: Payment) => payment.userid));
    }
    , [payments]);

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

    if (UserResults.some((result) => result.isLoading)) {
        return <div>Loading...</div>
    }

    if (UserResults.some((result) => result.isError)) {
        return <div>Error...</div>
    }

    const users = UserResults.map((result) => result.data);

    console.log('users', users);

    return (
        <>
            {payments.length === 0 && <div className='text-center pt-10 text-muted-foreground'>No transactions found for this offer</div>}
            {users.length > 0 && payments.map((payment: Payment, index: number) => (
                <div className='flex items-center space-x-4 p-4 border border-accent rounded-lg shadow-sm'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage src='/avatars/01.png' alt='Avatar' />
                  <AvatarFallback>
                    {users[index].f_name[0] && users[index].l_name[0] ? `${users[index].f_name[0]}${users[index].l_name[0]}` : 'UU'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {users[index].f_name || 'Unknown'} {users[index].l_name || 'User'}
                    </p>
                    <p className='text-sm text-muted-foreground'>{users[index].email || 'Unknown Email'}</p>
                  </div>
                  <div className='space-y-1 mt-2'>
                    <p className='text-sm font-semibold'>
                        {'Phone Number: ' + users[index].phone_number || 'Unknown Phone Number'}
                        </p>
                  </div>
                </div>
                <div className='ml-auto text-right'>
                  <p className='font-medium'>+${payment.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
        </>
    );
}

export default OfferTransactions;
