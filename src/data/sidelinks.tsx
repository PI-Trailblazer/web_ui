import {
  IconApps,
  IconBarrierBlock,
  IconBoxSeam,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconServerOff,
  IconSettings,
  IconTruck,
  IconUserShield,
  IconUsers,
} from '@tabler/icons-react'

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
    title: 'Comments',
    label: '10',
    href: '/requests',
    icon: <IconRouteAltLeft size={18} />,
    sub: [
      {
        title: 'My Comments',
        label: '9',
        href: '',
        icon: <IconExclamationCircle size={18} />,
      },
      {
        title: 'Comments on my offers',
        label: '',
        href: '',
        icon: <IconMessages  size={18} />,
      },
    ],
  },
]
