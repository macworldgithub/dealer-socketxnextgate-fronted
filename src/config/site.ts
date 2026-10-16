export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Dealer Socket Automation',
  dealership: process.env.NEXT_PUBLIC_DEALERSHIP_NAME || 'Dealer Socket Automation Hub',
  description: 'Enterprise Dealership Lead Automation & Ingestion Platform',
  navItems: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Leads Pipeline', href: '/dashboard', icon: 'Users' },
  ],
  apiEndpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      me: '/auth/me',
      refresh: '/auth/refresh',
    },
    leads: {
      list: '/leads',
      detail: (id: string) => `/leads/${id}`,
      create: '/leads',
      updateStatus: (id: string) => `/leads/${id}/status`,
      stats: '/leads/stats',
    },
  },
};
