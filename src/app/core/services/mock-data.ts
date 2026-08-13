import { Agent, AppNotification, ChatMessage, Company, Conversation, FeedPost, Lead, Property, User } from '../models/domain.models';

export const users: User[] = [
  {
    id: 'u-buyer',
    name: 'سلمى الإدريسي',
    email: 'buyer@demo.test',
    role: 'buyer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    location: 'الرباط'
  },
  {
    id: 'u-agent',
    name: 'يوسف بناني',
    email: 'agent@demo.test',
    role: 'agent',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    companyId: 'c-1',
    phone: '+212 661 102 904',
    location: 'الدار البيضاء'
  },
  {
    id: 'u-company',
    name: 'نورا العمراني',
    email: 'company@demo.test',
    role: 'company',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
    companyId: 'c-1',
    location: 'طنجة'
  }
];

export const companies: Company[] = [
  {
    id: 'c-1',
    name: 'أطلس للعقار',
    logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=240&q=80',
    description: 'وساطة عقارية مغربية تركّز على السكن الراقي والمكاتب الحديثة.',
    location: 'الدار البيضاء',
    agents: 18,
    listings: 124,
    leads: 389
  },
  {
    id: 'c-2',
    name: 'رباط هومز',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=240&q=80',
    description: 'فريق متخصص في شقق الرباط وتمارة وسلا.',
    location: 'الرباط',
    agents: 9,
    listings: 67,
    leads: 144
  }
];

export const agents: Agent[] = [
  {
    id: 'a-1',
    name: 'يوسف بناني',
    verified: true,
    companyId: 'c-1',
    location: 'الدار البيضاء',
    bio: 'مستشار عقاري بخبرة 8 سنوات في البيع والكراء المهني.',
    specialties: ['فلل', 'مكاتب', 'استثمار'],
    followers: 4200,
    avatarUrl: users[1].avatarUrl,
    phone: '+212 661 102 904'
  },
  {
    id: 'a-2',
    name: 'هند التازي',
    verified: true,
    companyId: 'c-2',
    location: 'الرباط',
    bio: 'تساعد العائلات على اختيار شقق قريبة من المدارس والخدمات.',
    specialties: ['شقق', 'كراء', 'عائلات'],
    followers: 2700,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
    phone: '+212 662 883 771'
  }
];

export const properties: Property[] = [
  {
    id: 'p-1',
    title: 'شقة فاخرة في الرباط',
    titleEn: 'Luxury apartment in Rabat',
    city: 'الرباط',
    district: 'أكدال',
    transaction: 'sale',
    type: 'apartment',
    price: 1850000,
    bedrooms: 3,
    bathrooms: 2,
    area: 132,
    furnished: true,
    parking: true,
    status: 'available',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'شقة مضيئة بتشطيبات راقية، قريبة من الترام والمدارس والمقاهي.',
    amenities: ['مصعد', 'حراسة', 'شرفة', 'موقف سيارات'],
    agentId: 'a-2',
    companyId: 'c-2',
    createdAt: '2026-08-02T10:00:00Z'
  },
  {
    id: 'p-2',
    title: 'فيلا حديثة في الدار البيضاء',
    titleEn: 'Modern villa in Casablanca',
    city: 'الدار البيضاء',
    district: 'عين الذئاب',
    transaction: 'sale',
    type: 'villa',
    price: 6200000,
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    furnished: false,
    parking: true,
    status: 'available',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'فيلا عائلية قرب البحر مع حديقة ومسبح ومساحات استقبال واسعة.',
    amenities: ['حديقة', 'مسبح', 'مطبخ مجهز', 'غرفة خادمة'],
    agentId: 'a-1',
    companyId: 'c-1',
    createdAt: '2026-08-04T09:30:00Z'
  },
  {
    id: 'p-3',
    title: 'مكتب تجاري في طنجة',
    titleEn: 'Commercial office in Tangier',
    city: 'طنجة',
    district: 'مالاباطا',
    transaction: 'rent',
    type: 'office',
    price: 18000,
    bedrooms: 0,
    bathrooms: 2,
    area: 180,
    furnished: true,
    parking: true,
    status: 'reserved',
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'],
    description: 'مكتب مجهز مناسب لشركة خدمات أو مركز مبيعات مع إطلالة بحرية.',
    amenities: ['إنترنت ألياف', 'قاعة اجتماعات', 'استقبال', 'موقف سيارات'],
    agentId: 'a-1',
    companyId: 'c-1',
    createdAt: '2026-08-05T11:45:00Z'
  },
  {
    id: 'p-4',
    title: 'محل تجاري قرب مراكش بلازا',
    titleEn: 'Retail shop near Marrakech Plaza',
    city: 'مراكش',
    district: 'كيليز',
    transaction: 'rent',
    type: 'shop',
    price: 26000,
    bedrooms: 0,
    bathrooms: 1,
    area: 96,
    furnished: false,
    parking: false,
    status: 'available',
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80'],
    description: 'واجهة واسعة وحركة مرور ممتازة لمشروع تجاري جديد.',
    amenities: ['واجهة زجاجية', 'مخزن', 'قرب مواقف'],
    agentId: 'a-2',
    companyId: 'c-2',
    createdAt: '2026-08-07T12:00:00Z'
  }
];

export const feedPosts: FeedPost[] = [
  {
    id: 'post-1',
    authorId: 'a-1',
    kind: 'insight',
    text: 'أسعار الفلل في عين الذئاب مستقرة هذا الشهر، لكن الطلب على المساحات الخارجية ارتفع بوضوح.',
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
    likes: 128,
    comments: 19,
    createdAt: '2026-08-08T15:00:00Z',
    following: true
  },
  {
    id: 'post-2',
    authorId: 'a-2',
    kind: 'property',
    text: 'زيارة مفتوحة نهاية الأسبوع لشقة أكدال. مناسبة للعائلات التي تبحث عن قرب المدارس والترام.',
    propertyId: 'p-1',
    likes: 91,
    comments: 11,
    createdAt: '2026-08-09T08:20:00Z',
    following: false
  }
];

export const leads: Lead[] = [
  {
    id: 'l-1',
    clientName: 'مريم العلوي',
    phone: '+212 661 000 112',
    email: 'meryem@example.com',
    propertyId: 'p-2',
    status: 'new',
    source: 'search',
    assignedAgentId: 'a-1',
    notes: 'مهتمة بزيارة الفيلا مساء الخميس.',
    nextFollowUp: '2026-08-12T17:00:00Z',
    history: ['تم إنشاء الطلب من صفحة التفاصيل']
  },
  {
    id: 'l-2',
    clientName: 'عمر المريني',
    phone: '+212 662 221 334',
    email: 'omar@example.com',
    propertyId: 'p-3',
    status: 'qualified',
    source: 'campaign',
    assignedAgentId: 'a-1',
    notes: 'شركة تبحث عن مكتب جاهز خلال شهر.',
    nextFollowUp: '2026-08-13T10:30:00Z',
    history: ['اتصال أولي', 'تم تأكيد الميزانية']
  }
];

export const conversations: Conversation[] = [
  {
    id: 'm-1',
    participantName: 'هند التازي',
    participantRole: 'agent',
    propertyId: 'p-1',
    unread: 2,
    lastMessage: 'أستطيع ترتيب زيارة غدا بعد الرابعة.',
    updatedAt: '2026-08-10T16:45:00Z'
  },
  {
    id: 'm-2',
    participantName: 'مريم العلوي',
    participantRole: 'buyer',
    propertyId: 'p-2',
    unread: 0,
    lastMessage: 'شكرا، سأرسل لك الموقع الآن.',
    updatedAt: '2026-08-10T14:12:00Z'
  }
];

export const messages: ChatMessage[] = [
  { id: 'msg-1', conversationId: 'm-1', sender: 'them', text: 'مرحبا، هل الشقة ما زالت متاحة؟', sentAt: '2026-08-10T16:20:00Z' },
  { id: 'msg-2', conversationId: 'm-1', sender: 'me', text: 'نعم، ويمكن ترتيب زيارة هذا الأسبوع.', sentAt: '2026-08-10T16:25:00Z' },
  { id: 'msg-3', conversationId: 'm-1', sender: 'them', text: 'أستطيع ترتيب زيارة غدا بعد الرابعة.', sentAt: '2026-08-10T16:45:00Z' }
];

export const notifications: AppNotification[] = [
  { id: 'n-1', title: 'عقار جديد يطابق بحثك', body: 'شقة في أكدال بميزانية قريبة من بحثك الأخير.', read: false, createdAt: '2026-08-10T09:00:00Z', kind: 'property' },
  { id: 'n-2', title: 'رد جديد على الرسائل', body: 'هند التازي اقترحت موعد زيارة.', read: false, createdAt: '2026-08-10T16:46:00Z', kind: 'message' },
  { id: 'n-3', title: 'تذكير متابعة', body: 'لديك متابعة مع مريم العلوي غدا.', read: true, createdAt: '2026-08-09T12:00:00Z', kind: 'lead' }
];
