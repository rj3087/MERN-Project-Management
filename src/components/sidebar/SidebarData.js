import React from 'react';
import {
  DocumentReportIcon,
  MenuIcon,
  OfficeBuildingIcon,
  InboxIcon,
  LogoutIcon,
  CogIcon,
  UserIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';

export const SidebarData = {
  MenuPrimary: [
    {
      title: 'Projects',
      icon: <DocumentReportIcon />,
      link: '/projects',
    },
    {
      title: 'My Tasks',
      icon: <MenuIcon />,
      link: '/tasks',
    },
    {
      title: 'Conversations',
      icon: <InboxIcon />,
      link: '/message',
    },
    {
      title: 'Settings',
      icon: <CogIcon />,
      link: '/settings',
      subItem: [
        {
          title: 'Department',
          icon: <OfficeBuildingIcon />,
          modal: 'Department',
        },
        {
          title: 'Client',
          icon: <UserIcon />,
          modal: 'Client',
        },
        {
          title: 'Team',
          icon: <UserGroupIcon />,
          modal: 'Team',
        },
      ],
    },
  ],
  MenuSecondary: [
    {
      title: 'Logout',
      icon: <LogoutIcon />,
      link: '/logout',
    },
  ],
};
