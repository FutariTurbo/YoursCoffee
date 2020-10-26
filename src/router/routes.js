export const routes = [
  {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/mainViews/Home.vue'),
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('../views/mainViews/Menu.vue'),
      },
      {
        path: 'shopbag',
        name: 'Shopbag',
        component: () => import('../views/mainViews/Shopbag.vue'),
      },
      {
        path: 'my',
        name: 'My',
        component: () => import('../views/mainViews/My.vue'),
      },
    ]
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/Detail.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue'),
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order.vue'),
  },
  {
    path: '/newAddress',
    name: 'NewAddress',
    component: () => import('../views/NewAddress.vue'),
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/Address.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue'),
  },
  {
    path: '/payorder',
    name: 'Payorder',
    component: () => import('../views/Payorder.vue'),
  },
  {
    path: '/mylike',
    name: 'Mylike',
    component: () => import('../views/Mylike.vue'),
  },
  {
    path: '/security',
    name: 'Security',
    component: () => import('../views/Security.vue'),
  },
  {
    path: '/forgotpassword',
    name: 'Forgotpassword',
    component: () => import('../views/Forgotpassword.vue'),
  },
  {
    path: '*',
    redirect: {
      name: 'Home'
    }
  }
]