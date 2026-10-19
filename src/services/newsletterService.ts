export interface Subscriber {
  id: string;
  email: string;
  fullName?: string;
  interest: 'all' | 'residential' | 'plots' | 'commercial' | 'diaspora';
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  source: 'blog' | 'footer' | 'header' | 'advisory' | 'manual';
}

export interface EmailUpdate {
  id: string;
  subject: string;
  preheader: string;
  category: 'Market Advisory' | 'New Property Launch' | 'Title & Development Update' | 'Diaspora Investment' | 'Welcome';
  audience: 'all' | 'residential' | 'plots' | 'commercial' | 'diaspora';
  message: string;
  spotlightProperty?: string;
  author: string;
  sentAt: string;
  recipientsCount: number;
  recipientEmails?: string[];
  status: 'delivered' | 'scheduled';
}

const STORAGE_KEY_SUBSCRIBERS = 'caih_newsletter_subscribers_v1';
const STORAGE_KEY_UPDATES = 'caih_newsletter_updates_v1';

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-1',
    email: 'diaspora.investor.uk@gmail.com',
    fullName: 'Dr. Babatunde Adeyemi',
    interest: 'diaspora',
    subscribedAt: '2026-03-12T10:30:00Z',
    status: 'active',
    source: 'blog'
  },
  {
    id: 'sub-2',
    email: 'chinwe.okonkwo.us@verizon.net',
    fullName: 'Mrs. Chinwe Okonkwo',
    interest: 'plots',
    subscribedAt: '2026-03-24T14:15:00Z',
    status: 'active',
    source: 'footer'
  },
  {
    id: 'sub-3',
    email: 'olumide.lawal@chevron.com',
    fullName: 'Engr. Olumide Lawal',
    interest: 'residential',
    subscribedAt: '2026-04-02T08:45:00Z',
    status: 'active',
    source: 'advisory'
  },
  {
    id: 'sub-4',
    email: 'investor.kemi@caihproperties.com',
    fullName: 'Kemi Balogun-Peters',
    interest: 'commercial',
    subscribedAt: '2026-04-10T16:20:00Z',
    status: 'active',
    source: 'blog'
  }
];

const INITIAL_UPDATES: EmailUpdate[] = [
  {
    id: 'upd-1',
    subject: 'Caih Group Advisory: Lekki-Epe Infrastructure Surge & Title Deed Approvals',
    preheader: 'Coastal Road expansion, Free Trade Zone logistics milestones, and new C of O allocations.',
    category: 'Market Advisory',
    audience: 'all',
    message: 'We are pleased to present our Q2 strategic market dispatch. Construction across the Lekki-Epe corridor has accelerated with rapid expansion of the Lagos-Calabar Coastal Highway. Caih Group has successfully concluded another round of Governor’s Consent and C of O document allocations for investors at Appleton Court and Appleton Enclave.',
    spotlightProperty: 'Appleton Court Terraces (Lekki Scheme 2)',
    author: 'Caih Group Research & Advisory Directorate',
    sentAt: '2026-04-05T09:00:00Z',
    recipientsCount: 4,
    recipientEmails: ['diaspora.investor.uk@gmail.com', 'chinwe.okonkwo.us@verizon.net', 'olumide.lawal@chevron.com', 'investor.kemi@caihproperties.com'],
    status: 'delivered'
  }
];

export const getStoredSubscribers = (): Subscriber[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(INITIAL_SUBSCRIBERS));
      return INITIAL_SUBSCRIBERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse subscribers from localStorage', err);
    return INITIAL_SUBSCRIBERS;
  }
};

export const saveSubscribers = (subscribers: Subscriber[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(subscribers));
  } catch (err) {
    console.error('Failed to save subscribers', err);
  }
};

export const getStoredUpdates = (): EmailUpdate[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UPDATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_UPDATES, JSON.stringify(INITIAL_UPDATES));
      return INITIAL_UPDATES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse updates from localStorage', err);
    return INITIAL_UPDATES;
  }
};

export const saveUpdates = (updates: EmailUpdate[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_UPDATES, JSON.stringify(updates));
  } catch (err) {
    console.error('Failed to save updates', err);
  }
};

export interface SubscriptionResult {
  success: boolean;
  message: string;
  isExisting?: boolean;
  subscriber: Subscriber;
  welcomeEmail: EmailUpdate;
}

export const subscribeClient = (
  email: string,
  fullName: string = '',
  interest: Subscriber['interest'] = 'all',
  source: Subscriber['source'] = 'blog'
): SubscriptionResult => {
  const cleanEmail = email.trim().toLowerCase();
  const subscribers = getStoredSubscribers();

  const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === cleanEmail);

  let subscriber: Subscriber;
  let isExisting = false;

  if (existingIndex >= 0) {
    // Re-activate if unsubscribed or update interest
    subscribers[existingIndex].status = 'active';
    if (fullName) subscribers[existingIndex].fullName = fullName;
    if (interest !== 'all') subscribers[existingIndex].interest = interest;
    subscriber = subscribers[existingIndex];
    isExisting = true;
  } else {
    subscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      fullName: fullName.trim() || undefined,
      interest,
      subscribedAt: new Date().toISOString(),
      status: 'active',
      source
    };
    subscribers.unshift(subscriber);
  }

  saveSubscribers(subscribers);

  // Generate automated Welcome Email Update
  const welcomeEmail: EmailUpdate = {
    id: `welcome-${Date.now()}`,
    subject: 'Welcome to Caih Group Property Intelligence & Investment Advisory',
    preheader: 'Your subscription is confirmed. Receive verified title listings and Nigerian real estate intelligence.',
    category: 'Welcome',
    audience: interest,
    message: `Dear ${subscriber.fullName || 'Valued Investor'},\n\nThank you for subscribing to Caih Group Real Estate Intelligence & Advisory.\n\nAs a subscriber, you will receive:\n• Early-bird notifications of direct allocation land parcels with verifiable C of O and Governor’s Consent.\n• Construction field dispatches from our active projects along the Lekki-Epe and Victoria Island corridors.\n• Transparent structural pricing, payment flexibility schedules, and milestone handover galleries.\n\nOur direct corporate investment desk is on standby in Lagos for tailored appraisals and on-site inspection bookings.\n\nWarm regards,\nCaih Group Corporate Desk\nLekki Peninsula, Lagos, Nigeria`,
    spotlightProperty: 'Appleton Enclave (Idera) & Appleton Haven (VI)',
    author: 'Caih Group Client Relations',
    sentAt: new Date().toISOString(),
    recipientsCount: 1,
    recipientEmails: [cleanEmail],
    status: 'delivered'
  };

  // Add welcome email to update log
  const updates = getStoredUpdates();
  updates.unshift(welcomeEmail);
  saveUpdates(updates);

  return {
    success: true,
    message: isExisting
      ? 'Subscription refreshed! Welcome email updates re-activated.'
      : 'Successfully subscribed! Welcome email dispatched to your inbox.',
    isExisting,
    subscriber,
    welcomeEmail
  };
};

export const unsubscribeClient = (email: string): boolean => {
  const subscribers = getStoredSubscribers();
  const sub = subscribers.find((s) => s.email.toLowerCase() === email.trim().toLowerCase());
  if (sub) {
    sub.status = 'unsubscribed';
    saveSubscribers(subscribers);
    return true;
  }
  return false;
};

export interface SendBroadcastParams {
  subject: string;
  preheader?: string;
  category: EmailUpdate['category'];
  audience: EmailUpdate['audience'];
  message: string;
  spotlightProperty?: string;
  author?: string;
}

export const dispatchBroadcastUpdate = (params: SendBroadcastParams): {
  success: boolean;
  sentUpdate: EmailUpdate;
  deliveredCount: number;
  recipientEmails: string[];
} => {
  const subscribers = getStoredSubscribers().filter((s) => s.status === 'active');

  const filtered = subscribers.filter((s) => {
    if (params.audience === 'all') return true;
    return s.interest === 'all' || s.interest === params.audience;
  });

  const recipientEmails = filtered.map((s) => s.email);

  const newUpdate: EmailUpdate = {
    id: `broadcast-${Date.now()}`,
    subject: params.subject.trim(),
    preheader: params.preheader?.trim() || params.message.slice(0, 100),
    category: params.category,
    audience: params.audience,
    message: params.message.trim(),
    spotlightProperty: params.spotlightProperty?.trim() || undefined,
    author: params.author?.trim() || 'Caih Group Editorial & Investment Desk',
    sentAt: new Date().toISOString(),
    recipientsCount: recipientEmails.length,
    recipientEmails,
    status: 'delivered'
  };

  const updates = getStoredUpdates();
  updates.unshift(newUpdate);
  saveUpdates(updates);

  return {
    success: true,
    sentUpdate: newUpdate,
    deliveredCount: recipientEmails.length,
    recipientEmails
  };
};

export const exportSubscribersToCSV = (): void => {
  const subscribers = getStoredSubscribers();
  const headers = ['ID', 'Email', 'Full Name', 'Interest', 'Subscribed At', 'Status', 'Source'];
  const rows = subscribers.map((s) => [
    s.id,
    `"${s.email}"`,
    `"${s.fullName || ''}"`,
    s.interest,
    s.subscribedAt,
    s.status,
    s.source
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `caih_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
