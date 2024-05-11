import {
  IconChecklist,
  IconExclamationCircle,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconSettings,
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
    href: '',
    icon: <IconRouteAltLeft size={18} />,
    sub: [
      {
        title: 'My Comments',
        label: '9',
        href: '/404',
        icon: <IconExclamationCircle size={18} />,
      },
      {
        title: 'Comments on my offers',
        label: '',
        href: '/404',
        icon: <IconMessages  size={18} />,
      },
    ],
  },
]
