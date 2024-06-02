import {
  IconChecklist,
  IconLayoutDashboard,
  IconSettings,
} from '@tabler/icons-react'

import {
  CandlestickChart,
  HandCoins,
  PiggyBank,
} from 'lucide-react';

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Account Settings',
    label: '',
    href: '/account',
    icon: <IconSettings size={18} />,
  },
  {
    title: 'My offers',
    label: '',
    href: '/account/your-offers',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Dashboard',
    label: '',
    href: '/account/dashboard',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Payments & Transactions',
    label: '',
    href: '',
    icon: <HandCoins size={18} />,
    sub: [
      {
        title: 'Transactions History',
        label: '',
        href: '/account/buy-history',
        icon: <PiggyBank size={18} />,
      },
      {
        title: 'My Offers Transactions',
        label: '',
        href: '/account/offers-transactions',
        icon: <CandlestickChart  size={18} />,
      },
    ],
  },
]
