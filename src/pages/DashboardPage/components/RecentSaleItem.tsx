import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OfferCardProps {
  user: any;
  offer: any;
  sale: any;
}

const RecentSaleItem: React.FC<OfferCardProps> = ({ user, offer, sale }) => {
  const initials = user?.f_name[0] && user?.l_name[0] ? `${user.f_name[0]}${user.l_name[0]}` : 'UU';

  return (
    <div className='flex items-center space-x-4 p-4 border border-accent rounded-lg shadow-sm'>
      <Avatar className='h-12 w-12'>
        <AvatarImage src='/avatars/01.png' alt='Avatar' />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className='flex-1'>
        <div className='space-y-1'>
          <p className='text-sm font-medium leading-none'>
            {user?.f_name || 'Unknown'} {user?.l_name || 'User'}
          </p>
          <p className='text-sm text-muted-foreground'>{user?.email || 'Unknown Email'}</p>
        </div>
        <div className='space-y-1 mt-2'>
          <p className='text-sm font-semibold'>{offer?.name || 'Unknown Offer'}</p>
        </div>
      </div>
      <div className='ml-auto text-right'>
        <p className='font-medium'>+${sale.amount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default RecentSaleItem
