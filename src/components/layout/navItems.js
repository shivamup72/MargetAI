import {
  LayoutDashboard,
  Store,
  Compass,
  TrendingUp,
  Crosshair,
  MessageSquare,
  Sparkles,
  Share2,
  Megaphone,
  BarChart3,
  Layers,
  CreditCard,
  Settings,
} from 'lucide-react';

// Single source of truth for app navigation (top bar, mobile menu, page search).
// `short` is the label used in the compact desktop bar; `desc` appears in dropdown menus.
export const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { name: 'Overview', short: 'Overview', path: '/', icon: LayoutDashboard, desc: 'Performance dashboard' },
      { name: 'My Businesses', short: 'Businesses', path: '/businesses', icon: Store, desc: 'Locations & listings' },
      { name: 'Google Business Profile', short: 'Google Profile', path: '/google-business', icon: Compass, desc: 'Profile, posts & photos' },
    ],
  },
  {
    label: 'Growth',
    icon: TrendingUp,
    items: [
      { name: 'Local SEO', path: '/local-seo', icon: TrendingUp, desc: 'Keyword rankings & audits' },
      { name: 'Competitor Analysis', short: 'Competitors', path: '/competitors', icon: Crosshair, desc: 'Benchmark nearby rivals' },
      { name: 'Reviews & Reputation', short: 'Reviews', path: '/reviews', icon: MessageSquare, badgeKey: 'pendingReviews', desc: 'Reply & monitor ratings' },
      { name: 'AI Content Studio', short: 'AI Studio', path: '/ai-studio', icon: Sparkles, isAi: true, desc: 'Generate posts & offers' },
      { name: 'Social Media', short: 'Social Media', path: '/social-media', icon: Share2, desc: 'Schedule & publish' },
      { name: 'Campaign Manager', short: 'Campaigns', path: '/campaigns', icon: Megaphone, desc: 'Local ad campaigns' },
      { name: 'Analytics & Reports', short: 'Analytics', path: '/analytics', icon: BarChart3, desc: 'Insights & exports' },
    ],
  },
  {
    label: 'Workspace',
    icon: Layers,
    items: [
      { name: 'Integrations', path: '/integrations', icon: Layers, desc: 'Connected apps' },
      { name: 'Billing & Subscription', short: 'Billing', path: '/billing', icon: CreditCard, desc: 'Plan & invoices' },
      { name: 'Settings', path: '/settings', icon: Settings, desc: 'Account & preferences' },
    ],
  },
];

export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export const isPathActive = (itemPath, currentPath) =>
  itemPath === '/' ? currentPath === '/' : currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
