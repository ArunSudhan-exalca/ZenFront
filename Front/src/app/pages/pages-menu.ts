import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Initiator Dashboard',
    icon: 'checkmark-square-outline',
    home: true,
    link: '/pages/dashboard'
  },
  {
    title: 'Register',
    icon: 'checkmark-square-outline',
    home: true,
    link: '/pages/initiator'
  },

 
];
export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
  

  {
    title: 'Master',
    icon: 'layout-outline',
    children: [
      // {
      //   title: 'OBDField',
      //   link: '/pages/obdfield',
      // },
      {
        title: 'Identity',
        link: '/pages/identity',
      },
      {
        title:'AddUser',
        link:'/pages/usercreation'
      }
    ]
  }
];
